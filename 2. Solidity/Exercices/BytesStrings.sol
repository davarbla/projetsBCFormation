// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract Test {
    bytes1 public b1 = 0xb5; // Un seul octet
    bytes2 public b2 = 0x1234; // Deux octets
    bytes32 public b32; // 32 octets, initialement à zéro

    function setB32(bytes32 _value) public {
        b32 = _value;
    }
}

contract Test2 {
    bytes public data;

    // Ajouter des données
    function appendData(bytes memory newData) public {
        data = abi.encodePacked(data, newData);
    }

    // Supprimer les derniers n octets
    function removeLastNBytes(uint n) public {
        require(n <= data.length, "Cannot remove more bytes than present.");
        bytes memory temp = new bytes(data.length - n);
        for(uint i = 0; i < data.length - n; i++) {
            temp[i] = data[i];
        }
        data = temp;
    }
}

contract Test3 {
    // Convertir bytes32 en address
    function bytes32ToAddress(bytes32 _bytes) public pure returns (address) {
        return address(uint160(uint256(_bytes)));
    }

    // Convertir address en bytes32
    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
}
