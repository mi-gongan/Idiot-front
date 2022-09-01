// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "../contracts/.deps/npm/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "../contracts/.deps/npm/@openzeppelin/contracts/utils/Counters.sol";

contract Ownable {
  address public _owner;

  constructor() {
    _owner = msg.sender;
  }

  function owner() public view returns (address) {
    return _owner;
  }

  modifier onlyOwner() {
    require(msg.sender == owner(), "Ownable: caller is not the owner");
    _;
  }
}

contract IdiotTower is ERC721Enumerable, Ownable {
  constructor() ERC721("Idiot Tower", "IDIOT") {}

  /*Token*/
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Counters.Counter private _ownerTokenCount;

  string[6] public colorArray = [
    "red",
    "green",
    "blue",
    "black",
    "gray",
    "white"
  ];
  string[6] public tokenURIArray = [
    "QmTG3A8rq5BQZwqLiJABEVsge2jjGre5XF9v5dDLyxhYmx",
    "Qmf7g9bVgHZDq4SydhPnPFfpkt3zndftAo8gPMF671Gi21",
    "QmSCEpSDxzQ6fB9jdbbAVEzHHwrgSpRh86tfG4SmpXVRtL",
    "QmYD6rjhhqrutAFNFP4KjfQnvgWwrjJNccEsW9hG4bt555",
    "QmY7K9ChdowJEPTT8fUAJvEy9UJTcGY6nXXoiTLXmpPtiR",
    "QmXfcgkDCQ3a1mJDsHRhNqY7yNtGo6hRoDAJGs3xS6dKYa"
  ];

  mapping(string => uint256) public tokenColorCount;
  mapping(uint256 => string) public tokenColorTypes;
  mapping(uint256 => string) public setTokenURI;

  struct TokenData {
    uint256 tokenId;
    string tokenColor;
    string tokenURI;
  }

  /*User*/

  address[] public addressArray;
  address[] public cowardArray;

  mapping(address => bool) public addressIsMinting;
  mapping(address => bool) public addressIsCoward;

  function mintAndPay(uint256 count) public payable {
    require(msg.sender != owner(), "Owner can't mint this token.");
    require(0.001 ether * count < msg.value, "Caller sent lower than price.");
    for (uint256 i = 0; i < count; i++) {
      _tokenIds.increment();
      uint256 tokenId = _tokenIds.current();
      uint256 colorIndex = uint256(
        keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
      ) % 6;

      tokenColorTypes[tokenId] = colorArray[colorIndex];
      tokenColorCount[colorArray[colorIndex]]++;
      setTokenURI[tokenId] = tokenURIArray[colorIndex];

      _mint(msg.sender, tokenId);
    }
    payable(owner()).transfer(msg.value);
    if (addressIsMinting[msg.sender] != true) createUser(msg.sender);
  }

  function ownerMint(uint256 count) public {
    require(msg.sender == owner(), "Caller is not owner");
    for (uint256 i = 0; i < count; i++) {
      require(
        _ownerTokenCount.current() < 201,
        "Owner can mint token below 200"
      );
      _tokenIds.increment();
      uint256 tokenId = _tokenIds.current();
      uint256 colorIndex = uint256(
        keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
      ) % 6;

      tokenColorTypes[tokenId] = colorArray[colorIndex];
      setTokenURI[tokenId] = tokenURIArray[colorIndex];
      tokenColorCount[colorArray[colorIndex]]++;

      _mint(msg.sender, tokenId);
      _ownerTokenCount.increment();
    }
    if (addressIsMinting[msg.sender] != true) createUser(msg.sender);
  }

  function getTokens(address _userAddress)
    external
    view
    returns (TokenData[] memory)
  {
    uint256 balanceLength = balanceOf(_userAddress);
    require(balanceLength != 0, "Owner did not have token.");

    TokenData[] memory tokenData = new TokenData[](balanceLength);
    for (uint256 i = 0; i < balanceLength; i++) {
      uint256 tokenId = tokenOfOwnerByIndex(_userAddress, i);
      tokenData[i] = TokenData(
        tokenId,
        tokenColorTypes[tokenId],
        tokenURIArray[tokenId]
      );
    }
    return tokenData;
  }

  function countTokenColor(string memory _color)
    external
    view
    returns (uint256)
  {
    return tokenColorCount[_color];
  }

  function createUser(address _userAddress) public {
    addressArray.push(_userAddress);
    addressIsMinting[_userAddress] = true;
    addressIsCoward[_userAddress] = false;
  }

  function getUserList() external view returns (address[] memory) {
    return addressArray;
  }

  function checkUserHaveMinted(address _userAddress)
    external
    view
    returns (bool)
  {
    if (addressIsMinting[_userAddress] == true) return true;
    return false;
  }

  function checkUserIsCoward(address _userAddress)
    external
    view
    returns (bool)
  {
    if (addressIsCoward[_userAddress] == true) {
      return true;
    }
    return false;
  }

  function getCowardList() external view returns (address[] memory) {
    return cowardArray;
  }

  function transferNFT(
    address _from,
    address _to,
    uint256 _tokenId
  ) public {
    require(ownerOf(_tokenId) == _from, "You are not owner of token.");
    addressIsCoward[_from];
    cowardArray.push(_from);
    safeTransferFrom(_from, _to, _tokenId);
  }

  function getBalance(address _userAddress) external view returns (uint256) {
    return balanceOf(_userAddress);
  }
}
