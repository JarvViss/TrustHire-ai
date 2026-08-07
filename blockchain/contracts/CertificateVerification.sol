// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateVerification {
    address public owner;

    struct Certificate {
        bytes32 hash;
        string candidateName;
        string resumeId;
        uint8 interviewScore;
        uint256 timestamp;
    }

    mapping(bytes32 => Certificate) private _certificates;
    mapping(bytes32 => bool) private _verified;

    event CertificateVerified(bytes32 indexed hash, address indexed by, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed hash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Called by the server's wallet (the owner). Public writes are rejected.
    function verifyCertificate(
        bytes32 hash,
        string calldata candidateName,
        string calldata resumeId,
        uint8 interviewScore
    ) external onlyOwner {
        require(hash != bytes32(0), "Invalid hash");
        require(!_verified[hash], "Certificate already exists");

        _certificates[hash] = Certificate({
            hash: hash,
            candidateName: candidateName,
            resumeId: resumeId,
            interviewScore: interviewScore,
            timestamp: block.timestamp
        });
        _verified[hash] = true;

        emit CertificateVerified(hash, msg.sender, block.timestamp);
    }

    // Read-only, free for anyone to call
    function checkCertificate(bytes32 hash) external view returns (bool) {
        return _verified[hash];
    }

    function getCertificate(bytes32 hash)
        external
        view
        returns (
            bytes32 certHash,
            string memory candidateName,
            string memory resumeId,
            uint8 interviewScore,
            uint256 timestamp
        )
    {
        Certificate storage cert = _certificates[hash];
        certHash = cert.hash;
        candidateName = cert.candidateName;
        resumeId = cert.resumeId;
        interviewScore = cert.interviewScore;
        timestamp = cert.timestamp;
    }

    function revokeCertificate(bytes32 hash) external onlyOwner {
        require(_verified[hash], "Certificate not found");
        delete _certificates[hash];
        _verified[hash] = false;
        emit CertificateRevoked(hash);
    }
}
