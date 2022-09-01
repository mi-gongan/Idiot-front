# IDOIT TOWER 문제

## 개요

가상의 아티스트 그룹 Idiots에서는 자신들만의 NFT를 만들어보고 싶어졌다. 하지만, 이 그룹은 매우 특이한 그룹이라 평범한 NFT로는 만족하지 못하고, 새로운 형태의 NFT를 만들고 싶어졌다.

그들은 다음과 같은 NFT를 만들고 싶어한다.

- 원칙 1) 절대로 쓸모가 있어서는 안된다. => 한번 구매한 NFT를 상대에게 transfer할시 그에 상응하는 가치를 0으로 정한다
- 원칙 2) 보유한 NFT의 수에 따라서 그룹 내 서열을 정한다.
- 원칙 3) 스마트 컨트랙트를 배포한 지갑에 족쇄를 채워, 해당 지갑이 1등이 되는 일을 막는다.
- 원칙 4) 한 번이라도 NFT를 Transfer한 지갑 주소는 “겁쟁이”로 낙인 찍는다.

## 컨트랙트

### 라이브러리/환경

- 아직 ERC1155 기반 토큰 전송을 지원하지 않는 지갑(metamask)들이 있고 불변성 측면에서 보장된 ERC721 채택 + ERC1155는 소유권 추적도 어렵다.
- 오버플로,언더플로가 발생할 수 있으므로 Counter라는 라이브러리를 사용
- 스마트 컨트랙트를 배포한 지갑 계정을 Owner로 설정 => Ownable 컨트랙트를 상속
- 기본적으로 컴파일과 배포가 자유롭고 테스트를 하기 쉬운 환경인 truffle 채택

### 함수

- function ownerMint(uint256 count) public onlyOwner {}
  컨트랙트를 배포한 owner가 민팅할 수 있는 함수

- function getCowardList() public {}
  coward 리스트를 반환하는 함수

- function transferNFT( address \_from, address \_to, uint256 \_tokenId) public {}
  \_from 계정으로부터 \_to 계정으로 tokenId의 NFT를 전송하는 함수 / ether는 지불하지 않음

#### payble

- function mintAndPay(uint256 count) public payable {}
  일반 사용자들이 민팅할 수 있는 함수 / 0.01ether 지불해야함

#### view

- function getTokens(address \_userAddress) public view returns (TokenData[] memory) {}
  보유하고 있는 토큰을 반환하는 함수

- function countTokenColor(string memory \_color) public view returns(uint256){}
  색깔별로 민팅된 갯수를 반환하는 함수

- function createUser(address \_userAddress) public {}
  유저를 만드는 함수 / 처음 민팅을 하는 경우 실행됨

- function getUserList() public view returns(address[] memory){}
  유저 리스트를 불러오는 함수

- function checkUserHaveMinted(address \_userAddress) public view returns(bool){}
  민팅을 했는지 체크하는 함수

- function checkUserIsCoward(address \_userAddress) public view returns(bool){}
  coward 인지 체크하는 함수

## Frontend(라우팅별)

### /

유저리스트와 coward 리스트를 볼 수 있습니다.

### /minting

색깔별 민팅된 갯수를 볼수 있으며 민팅을 할 수 있습니다.

### /mypage

- 내 계정에 대한 정보(겁쟁이 여부, 민팅 여부, 토큰 갯수)를 보여주며 가지고 있는 토큰을 가지고 옵니다.
- NFT 선물하기 버튼을 누르면 주소를 입력받을 수 있는 창이 나오며 주소를 누르고 전송하면 해당하는 NFT를 전달합니다.

## 테스트 코드

truffle 환경에서 chai를 사용하여 테스트

#### case1 : 각 값들이 정확하게 생성되었는지 점검

- 1.1. 토큰 이름
- 1.2. 토큰 심볼
- 1.3. owner 주소가 정확한지

#### case2 : 각 역할에 맞게 NFT 발행이 거부되는가

- 2.1. owner가 그냥 mint를 한 경우
- 2.2. 일반 사용자가 owner mint를 한 경우

#### case3 : 민팅이 문제없이 작동하는가

- 3.1. 사용자 민팅이 작동하는가
- 3.2. 사용자 민팅했는지 체크
- 3.3. owner 민팅이 작동하는가
- 3.4. owner 민팅했는지 체크

#### case4 : 민팅한 갯수만큼 각자 소유하고 있으며 더했을때 총 개수와 일치하는가

- 4.1. 사용자 NFT 개수확인
- 4.2. owner NFT 개수 확인

#### case5 : transferNFT가 문제없이 작동하고 transfer한 유저가 coward에 등록되었는가

- 5.1. transferNFT 작동
- 5.2. 보낸 유저의 NFT 변동확인
- 5.3. 받는 유저의 NFT 변동확인
- 5.4. transfer한 유저 coward인지 체크

#### case6 : 유저 리스트, coward 리스트에 적절히 등록되었는가

- 6.1. 유저 리스트
- 6.2. coward 리스트
