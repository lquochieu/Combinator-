// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.4;

/**
 * @title LendingPoolAddressesProvider contract
 * @dev Main registry of addresses part of or connected to the protocol, including permissioned roles
 * - Acting also as factory of proxies and admin of those, so with right to change its implementations
 * - Owned by the Trava Governance
 * @author Trava
 **/
interface IAddressesProviderFactory {
    event LendingPoolUpdated(uint256 providerId, address indexed newAddress);
    event ConfigurationAdminUpdated(
        uint256 providerId,
        address indexed newAddress
    );
    event EmergencyAdminUpdated(uint256 providerId, address indexed newAddress);
    event LendingPoolConfiguratorUpdated(
        uint256 providerId,
        address indexed newAddress
    );
    event LendingPoolCollateralManagerUpdated(
        uint256 providerId,
        address indexed newAddress
    );
    event PriceOracleUpdated(uint256 providerId, address indexed newAddress);
    event LendingRateOracleUpdated(
        uint256 providerId,
        address indexed newAddress
    );
    event ProxyCreated(
        uint256 providerId,
        bytes32 id,
        address indexed newAddress
    );
    event AddressSet(
        uint256 providerId,
        bytes32 id,
        address indexed newAddress,
        bool hasProxy
    );
    event PoolConfigured(
        address pool, 
        uint256
    );

    function setAddress(
        uint256 providerId,
        bytes32 id,
        address newAddress
    ) external;

    function getAddress(uint256 providerId, bytes32 id)
        external
        view
        returns (address);

    function getLendingPool(uint256 providerId) external view returns (address);

    function setLendingPoolImpl(uint256 providerId, address pool) external;

    function initPool(
        address pool,
        address priceOracle,
        address configurator
    ) external returns (uint256);

    function getLendingPoolConfigurator(uint256 providerId)
        external
        view
        returns (address);

    function setLendingPoolConfiguratorImpl(
        uint256 providerId,
        address configurator
    ) external;

    function getLendingPoolCollateralManager(uint256 providerId)
        external
        view
        returns (address);

    function setLendingPoolCollateralManager(
        uint256 providerId,
        address manager
    ) external;

    function getPoolOwner(uint256 providerId) external view returns (address);

    function getPoolUpdateController() external view returns (address);

    function getGovernance() external view returns (address);

    function getPriceOracle(uint256 providerId) external view returns (address);

    function setPriceOracle(uint256 providerId, address priceOracle) external;

    function getLendingRateOracle(uint256 providerId)
        external
        view
        returns (address);

    function setLendingRateOracle(uint256 providerId, address lendingRateOracle)
        external;
}
