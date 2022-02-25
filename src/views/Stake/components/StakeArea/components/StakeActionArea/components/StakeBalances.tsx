import { t } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { convertGohmToOhm, formatNumber, nonNullable, parseBigNumber } from "src/helpers";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && parseBigNumber(balance, units) > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);

const formatBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && formatNumber(parseBigNumber(balance, units), DECIMAL_PLACES_SHOWN);

export const StakeBalances = () => {
  const ohmBalances = useOhmBalance();
  const sohmBalances = useSohmBalance();
  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();
  const v1sohmBalances = useV1SohmBalance();
  const gohmFuseBalances = useFuseBalance();
  const gohmTokemakBalances = useGohmTokemakBalance();

  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const sohmTokens = [sohmBalances[networks.MAINNET].data, v1sohmBalances[networks.MAINNET].data];
  const totalSohmBalance = sohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const gohmTokens = [
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
    gohmFuseBalances[NetworkId.MAINNET].data,
    gohmTokemakBalances[NetworkId.MAINNET].data,
  ];
  const totalGohmBalance = gohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const totalStakedBalance = currentIndex
    ? formatBalance(totalSohmBalance.mul(10 ** 9).add(convertGohmToOhm(totalGohmBalance, currentIndex)), 18)
    : BigNumber.from(0);

  const allBalancesLoaded = sohmTokens.every(Boolean) && gohmTokens.every(Boolean);

  return (
    <>
      <DataRow
        id="user-balance"
        title={t`Unstaked Balance`}
        isLoading={!ohmBalances[networks.MAINNET].data}
        balance={`${formatBalance(ohmBalances[networks.MAINNET].data)} ZEN`}
      />

      <Accordion className="stake-accordion" square defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
          <DataRow
            id="user-staked-balance"
            isLoading={!allBalancesLoaded}
            title={t`Total Staked Balance`}
            balance={`${totalStakedBalance} sZEN`}
          />
        </AccordionSummary>

        <AccordionDetails>
          <DataRow
            indented
            title={t`sZEN`}
            id="user-staked-balance"
            isLoading={!sohmBalances[networks.MAINNET].data}
            balance={`${formatBalance(sohmBalances[networks.MAINNET].data)} sZEN`}
          />

          <DataRow
            indented
            title={t`gZEN`}
            isLoading={!gohmBalances[networks.MAINNET].data}
            balance={`${formatBalance(gohmBalances[networks.MAINNET].data, 18)} gZEN`}
          />

          {hasVisibleBalance(gohmBalances[NetworkId.ARBITRUM].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Arbitrum)`}
              isLoading={!gohmBalances[NetworkId.ARBITRUM].data}
              balance={`${formatBalance(gohmBalances[NetworkId.ARBITRUM].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.AVALANCHE].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Avalanche)`}
              isLoading={!gohmBalances[NetworkId.AVALANCHE].data}
              balance={`${formatBalance(gohmBalances[NetworkId.AVALANCHE].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.POLYGON].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Polygon)`}
              isLoading={!gohmBalances[NetworkId.POLYGON].data}
              balance={`${formatBalance(gohmBalances[NetworkId.POLYGON].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.FANTOM].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Fantom)`}
              isLoading={!gohmBalances[NetworkId.FANTOM].data}
              balance={`${formatBalance(gohmBalances[NetworkId.FANTOM].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(gohmTokemakBalances[NetworkId.MAINNET].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Tokemak)`}
              isLoading={!gohmTokemakBalances[NetworkId.MAINNET].data}
              balance={`${formatBalance(gohmTokemakBalances[NetworkId.MAINNET].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(gohmFuseBalances[NetworkId.MAINNET].data, 18) && (
            <DataRow
              indented
              title={t`gZEN (Fuse)`}
              isLoading={!gohmFuseBalances[NetworkId.MAINNET].data}
              balance={`${formatBalance(gohmFuseBalances[NetworkId.MAINNET].data, 18)} gZEN`}
            />
          )}

          {hasVisibleBalance(v1sohmBalances[networks.MAINNET].data) && (
            <DataRow
              indented
              title={t`sZEN (v1)`}
              isLoading={!v1sohmBalances[networks.MAINNET].data}
              balance={`${formatBalance(v1sohmBalances[networks.MAINNET].data)} sZEN`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[networks.MAINNET].data, 18) && (
            <DataRow
              indented
              title={t`wsZEN`}
              isLoading={!wsohmBalances[networks.MAINNET].data}
              balance={`${formatBalance(wsohmBalances[networks.MAINNET].data, 18)} wsZEN`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.ARBITRUM].data, 18) && (
            <DataRow
              indented
              title={t`wsZEN (Arbitrum)`}
              isLoading={!wsohmBalances[NetworkId.ARBITRUM].data}
              balance={`${formatBalance(wsohmBalances[NetworkId.ARBITRUM].data, 18)} wsZEN`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.AVALANCHE].data, 18) && (
            <DataRow
              indented
              title={t`wsZEN (Avalanche)`}
              isLoading={!wsohmBalances[NetworkId.AVALANCHE].data}
              balance={`${formatBalance(wsohmBalances[NetworkId.AVALANCHE].data, 18)} wsZEN`}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
