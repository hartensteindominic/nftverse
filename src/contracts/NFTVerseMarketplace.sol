// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTVerseMarketplace is IERC721Receiver, ReentrancyGuard, Ownable {
    struct Listing { address seller; uint256 price; bool active; }

    IERC721 public immutable nft;
    uint96 public platformFeeBps = 250;
    uint96 public creatorRoyaltyBps = 500;
    address payable public feeRecipient;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event Sold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event FeesUpdated(uint96 platformFeeBps, uint96 creatorRoyaltyBps, address feeRecipient);

    constructor(address nftAddress, address payable recipient) Ownable(msg.sender) {
        require(nftAddress != address(0), "Invalid NFT contract");
        require(recipient != address(0), "Invalid fee recipient");
        nft = IERC721(nftAddress);
        feeRecipient = recipient;
    }

    function list(uint256 tokenId, uint256 price) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price is zero");
        require(nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");
        listings[tokenId] = Listing(msg.sender, price, true);
        emit Listed(tokenId, msg.sender, price);
    }

    function cancel(uint256 tokenId) external {
        Listing memory l = listings[tokenId];
        require(l.active, "Not listed");
        require(l.seller == msg.sender, "Not seller");
        delete listings[tokenId];
        emit ListingCancelled(tokenId, msg.sender);
    }

    function buy(uint256 tokenId) external payable nonReentrant {
        Listing memory l = listings[tokenId];
        require(l.active, "Not listed");
        require(msg.value == l.price, "Wrong payment");
        require(nft.ownerOf(tokenId) == l.seller, "Seller no longer owns NFT");
        require(nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(l.seller, address(this)), "Marketplace approval revoked");

        delete listings[tokenId];
        uint256 platformFee = (msg.value * platformFeeBps) / 10_000;
        uint256 royalty = (msg.value * creatorRoyaltyBps) / 10_000;
        address creator;
        try INFTVerse(address(nft)).originalCreators(tokenId) returns (address c) { creator = c; } catch {}
        if (creator == address(0) || creator == l.seller) royalty = 0;
        uint256 sellerProceeds = msg.value - platformFee - royalty;

        nft.safeTransferFrom(l.seller, msg.sender, tokenId);
        _send(feeRecipient, platformFee);
        if (royalty > 0) _send(payable(creator), royalty);
        _send(payable(l.seller), sellerProceeds);
        emit Sold(tokenId, l.seller, msg.sender, msg.value);
    }

    function setFees(uint96 newPlatformFeeBps, uint96 newCreatorRoyaltyBps, address payable newRecipient) external onlyOwner {
        require(newPlatformFeeBps + newCreatorRoyaltyBps <= 1_000, "Fees exceed 10%");
        require(newRecipient != address(0), "Invalid fee recipient");
        platformFeeBps = newPlatformFeeBps;
        creatorRoyaltyBps = newCreatorRoyaltyBps;
        feeRecipient = newRecipient;
        emit FeesUpdated(newPlatformFeeBps, newCreatorRoyaltyBps, newRecipient);
    }

    function _send(address payable to, uint256 amount) private {
        if (amount == 0) return;
        (bool ok,) = to.call{value: amount}("");
        require(ok, "Payment failed");
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}

interface INFTVerse { function originalCreators(uint256 tokenId) external view returns (address); }
