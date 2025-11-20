import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import classes from "./DepositLoan.module.scss";
import { useSelector } from "react-redux";
import { selectDepositLoanDetails, selectLoanOutstandingDetails } from "../../../redux/store/dashboardSlice";
import { useGetDepositLoanDetailsQuery, useGetLoanOutstandingDetailsQuery } from "../../../services/dashboardApi";

const mm = (arr) => {
  if (!arr || !arr.length) return { min: 0, max: 0 };
  let min = arr[0], max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return { min, max };
};

const fmtM = (n) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
const tickFmt = (v) => fmtM(Number(v) || 0);

const buildSeries = (cfg) => {
  const labels = (cfg && cfg.labels) || [];
  const data = (cfg && cfg.data) || [];
  if (!labels.length || !data.length) return [{ label: "", value: 0 }];
  return labels.map((label, i) => ({ label, value: data[i] ?? 0 }));
};

/* -------------------- TrendHeader -------------------- */
function TrendHeader({ title, view, onViewChange, account, onAccountChange }) {
  const views = ["YoY", "MoM", "QoQ"];
  const accounts = ["Acc No.1", "Acc No.2", "Acc No.3"];

  return (
    <div className={classes.chartHeader}>
      <div className={classes.headerTitle}>{title}</div>

      <div className={classes.headerRight}>
        <div className={classes.segment}>
          {views.map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                className={`${classes.segmentItem} ${active ? classes.segmentItemActive : ""}`}
              >
                {v}
              </button>
            );
          })}
        </div>

        <select
          value={account}
          onChange={(e) => onAccountChange(e.target.value)}
          className={classes.select}
        >
          {accounts.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* -------------------- TrendCard -------------------- */
function TrendCard({
  title,
  yTitle,
  rightAxis = false,
  loadData,
  initialSeries,
  defaultAccount = "Acc No.1",
}) {
  const [view, setView] = useState("MoM");
  const [account, setAccount] = useState(defaultAccount);

  const [series, setSeries] = useState(initialSeries);
  const cfg = (series && series[view]) || { labels: [], data: [] };

  // Update series when initialSeries changes (RTK Query data arrives)
  useEffect(() => {
    setSeries(initialSeries);
  }, [initialSeries]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (typeof loadData === "function") {
          const next = await loadData(account);
          if (alive && next) setSeries(next);
        }
      } catch (e) {
        console.error(`${title} load failed`, e);
      }
    })();
    return () => { alive = false; };
  }, [account, loadData, title]);

  const data = useMemo(() => buildSeries(cfg), [cfg]);
  const minMax = useMemo(() => (cfg.data && cfg.data.length ? mm(cfg.data) : { min: 0, max: 0 }), [cfg]);

  return (
    <div className={classes.card}>
      <TrendHeader
        title={title}
        view={view}
        onViewChange={setView}
        account={account}
        onAccountChange={setAccount}
      />

      <div className={classes.headerHr} />

      <div className={classes.badgeRowRight}>
        <div className={classes.badge}>
          <span>Lowest:</span>&nbsp;<strong>{fmtM(minMax.min)}</strong>
        </div>
        <div className={classes.badge}>
          <span>Highest:</span>&nbsp;<strong>{fmtM(minMax.max)}</strong>
        </div>
      </div>

      <div className={classes.chartBox}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#ddd" }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              yAxisId={rightAxis ? "right" : "left"}
              orientation={rightAxis ? "right" : "left"}
              tickFormatter={tickFmt}
              axisLine={{ stroke: "#ddd" }}
              tickLine={false}
            >
              <Label
                value={yTitle}
                position={rightAxis ? "insideRight" : "insideLeft"}
                angle={-90}
                style={{ textAnchor: "middle", fontWeight: 600 }}
              />
            </YAxis>
            <Tooltip
              formatter={(val) => [fmtM(Number(val)), title]}
              labelFormatter={(l) => l}
            />
            <Line
              type="monotone"
              dataKey="value"
              yAxisId={rightAxis ? "right" : "left"}
              stroke="#FF9800"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* -------------------- Page -------------------- */
export default function DepositLoan() {
  const { data: depositData } = useGetDepositLoanDetailsQuery();
  const { data: loanData } = useGetLoanOutstandingDetailsQuery();
  const reduxDeposits = useSelector(selectDepositLoanDetails);
  const reduxLoans = useSelector(selectLoanOutstandingDetails);

  const depositsFallback = depositData ?? reduxDeposits;
  const loansFallback = loanData ?? reduxLoans;

  // Mock API adapters (handle all views dynamically)
  const loadDeposits = async (account) => {
    if (!depositsFallback) return { MoM: { labels: [], data: [] }, YoY: { labels: [], data: [] }, QoQ: { labels: [], data: [] } };
    const factor = account === "Acc No.2" ? 1.05 : account === "Acc No.3" ? 0.95 : 1;

    const updatedSeries = {};
    ["MoM", "YoY", "QoQ"].forEach((view) => {
      updatedSeries[view] = {
        labels: depositsFallback[view]?.labels ?? [],
        data: depositsFallback[view]?.data.map((v) => +(v * factor).toFixed(2)) ?? [],
      };
    });
    return updatedSeries;
  };

  const loadLoans = async (account) => {
    if (!loansFallback) return { MoM: { labels: [], data: [] }, YoY: { labels: [], data: [] }, QoQ: { labels: [], data: [] } };
    const factor = account === "Acc No.2" ? 0.95 : account === "Acc No.3" ? 1.08 : 1;

    const updatedSeries = {};
    ["MoM", "YoY", "QoQ"].forEach((view) => {
      updatedSeries[view] = {
        labels: loansFallback[view]?.labels ?? [],
        data: loansFallback[view]?.data.map((v) => +(v * factor).toFixed(2)) ?? [],
      };
    });
    return updatedSeries;
  };

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.col}>
          <TrendCard
            title="Deposit Trends"
            yTitle="Deposits"
            rightAxis={false}
            loadData={loadDeposits}
            initialSeries={depositsFallback}
            defaultAccount="Acc No.1"
          />
        </div>
        <div className={classes.col}>
          <TrendCard
            title="Loan Outstanding Trends"
            yTitle="Loan Outstanding"
            rightAxis={false}
            loadData={loadLoans}
            initialSeries={loansFallback}
            defaultAccount="Acc No.1"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------- PropTypes -------------------- */
TrendHeader.propTypes = {
  title: PropTypes.string.isRequired,
  view: PropTypes.oneOf(["YoY", "MoM", "QoQ"]).isRequired,
  onViewChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  onAccountChange: PropTypes.func.isRequired,
};

TrendCard.propTypes = {
  title: PropTypes.string.isRequired,
  yTitle: PropTypes.string.isRequired,
  rightAxis: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  initialSeries: PropTypes.shape({
    MoM: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      data: PropTypes.arrayOf(PropTypes.number),
    }),
    YoY: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      data: PropTypes.arrayOf(PropTypes.number),
    }),
    QoQ: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      data: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  defaultAccount: PropTypes.string,
};

TrendCard.defaultProps = {
  rightAxis: false,
  initialSeries: {
    MoM: { labels: [], data: [] },
    YoY: { labels: [], data: [] },
    QoQ: { labels: [], data: [] },
  },
  defaultAccount: "Acc No.1",
};
