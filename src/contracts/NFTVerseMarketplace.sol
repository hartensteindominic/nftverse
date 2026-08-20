// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFTVerse Marketplace
/// @notice Non-custodial fixed-price marketplace for NFTVerse ERC-721 assets.
/// @dev NFTs remain in the seller wallet until a successful purchase. Payments
///      are credited to recipients and can be withdrawn, preventing a failed
///      recipient callback from blocking an otherwise valid sale.
contract NFTVerseMarketplace is IERC721Receiver, ReentrancyGuard, Pausable, Ownable {
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MAX_TOTAL_FEE_BPS = 1_000;

    struct Listing {
        address seller;
        uint128 price;
        bool active;
    }

    IERC721 public immutable nft;
    uint96 public platformFeeBps = 250;
    uint96 public creatorRoyaltyBps = 500;
    address payable public feeRecipient;

    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public pendingWithdrawals;

    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event Sold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 platformFee,
        uint256 creatorRoyalty
    );
    event FeesUpdated(uint96 platformFeeBps, uint96 creatorRoyaltyBps, address feeRecipient);
    event ProceedsWithdrawn(address indexed account, uint256 amount);

    constructor(address nftAddress, address payable recipient) Ownable(msg.sender) {
        require(nftAddress != address(0), "Invalid NFT contract");
        require(recipient != address(0), "Invalid fee recipient");
        nft = IERC721(nftAddress);
        feeRecipient = recipient;
    }

    function list(uint256 tokenId, uint256 price) external whenNotPaused {
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0 && price <= type(uint128).max, "Invalid price");
        _requireApproved(msg.sender, tokenId);

        Listing storage current = listings[tokenId];
        if (current.active) {
            uint256 oldPrice = current.price;
            current.price = uint128(price);
            current.seller = msg.sender;
            emit ListingUpdated(tokenId, oldPrice, price);
            return;
        }

        listings[tokenId] = Listing({seller: msg.sender, price: uint128(price), active: true});
        emit Listed(tokenId, msg.sender, price);
    }

    function cancel(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not seller");
        delete listings[tokenId];
        emit ListingCancelled(tokenId, msg.sender);
    }

    function buy(uint256 tokenId) external payable nonReentrant whenNotPaused {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(msg.sender != listing.seller, "Seller cannot buy");
        require(msg.value == listing.price, "Wrong payment");
        require(nft.ownerOf(tokenId) == listing.seller, "Seller no longer owns NFT");
        _requireApproved(listing.seller, tokenId);

        uint256 platformFee = (msg.value * platformFeeBps) / BPS_DENOMINATOR;
        uint256 royalty = (msg.value * creatorRoyaltyBps) / BPS_DENOMINATOR;
        address creator = _creatorOf(tokenId);

        if (creator == address(0) || creator == listing.seller) royalty = 0;

        uint256 sellerProceeds = msg.value - platformFee - royalty;
        delete listings[tokenId];

        // The NFT never enters marketplace custody. The transfer is atomic with the sale.
        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);

        _credit(feeRecipient, platformFee);
        _credit(payable(listing.seller), sellerProceeds);
        if (royalty > 0) _credit(payable(creator), royalty);

        emit Sold(tokenId, listing.seller, msg.sender, msg.value, platformFee, royalty);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        pendingWithdrawals[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Withdrawal failed");
        emit ProceedsWithdrawn(msg.sender, amount);
    }

    function setFees(
        uint96 newPlatformFeeBps,
        uint96 newCreatorRoyaltyBps,
        address payable newRecipient
    ) external onlyOwner {
        require(
            uint256(newPlatformFeeBps) + uint256(newCreatorRoyaltyBps) <= MAX_TOTAL_FEE_BPS,
            "Fees exceed 10%"
        );
        require(newRecipient != address(0), "Invalid fee recipient");

        platformFeeBps = newPlatformFeeBps;
        creatorRoyaltyBps = newCreatorRoyaltyBps;
        feeRecipient = newRecipient;
        emit FeesUpdated(newPlatformFeeBps, newCreatorRoyaltyBps, newRecipient);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }

    function _requireApproved(address owner, uint256 tokenId) private view {
        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(owner, address(this)),
            "Marketplace not approved"
        );
    }

    function _creatorOf(uint256 tokenId) private view returns (address creator) {
        try INFTVerse(address(nft)).originalCreators(tokenId) returns (address c) {
            creator = c;
        } catch {
            creator = address(0);
        }
    }

    function _credit(address payable account, uint256 amount) private {
        if (amount > 0) pendingWithdrawals[account] += amount;
    }

    receive() external payable {}

    // This marketplace is deliberately non-custodial. Reject direct NFT deposits
    // so users cannot accidentally lock an asset that has not been listed.
    function onERC721Received(address, address, uint256, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        revert("Marketplace is non-custodial");
    }
}

interface INFTVerse {
    function originalCreators(uint256 tokenId) external view returns (address);
}
