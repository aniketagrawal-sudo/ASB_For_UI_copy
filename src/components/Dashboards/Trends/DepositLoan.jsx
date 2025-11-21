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

  const [series, setSeries] = useState(() => {
    // normalize initialSeries if passed at module load time
    if (!initialSeries || typeof initialSeries !== "object") {
      return {
        MoM: { labels: [], data: [] },
        YoY: { labels: [], data: [] },
        QoQ: { labels: [], data: [] },
      };
    }
    const normalized = {};
    ["MoM", "YoY", "QoQ"].forEach((v) => {
      const raw = initialSeries[v];
      if (Array.isArray(raw)) {
        // pick the first entry if array (common case based on your data)
        normalized[v] = raw[0] ? { labels: raw[0].labels ?? [], data: raw[0].data ?? [] } : { labels: [], data: [] };
      } else if (raw && typeof raw === "object") {
        normalized[v] = { labels: raw.labels ?? [], data: raw.data ?? [] };
      } else {
        normalized[v] = { labels: [], data: [] };
      }
    });
    return normalized;
  });

  const cfg = (series && series[view]) || { labels: [], data: [] };

  // Update series when initialSeries changes (RTK Query data arrives)
  useEffect(() => {
    if (!initialSeries || typeof initialSeries !== "object") {
      setSeries({
        MoM: { labels: [], data: [] },
        YoY: { labels: [], data: [] },
        QoQ: { labels: [], data: [] },
      });
      return;
    }
    const normalized = {};
    ["MoM", "YoY", "QoQ"].forEach((v) => {
      const raw = initialSeries[v];
      if (Array.isArray(raw)) {
        normalized[v] = raw[0] ? { labels: raw[0].labels ?? [], data: raw[0].data ?? [] } : { labels: [], data: [] };
      } else if (raw && typeof raw === "object") {
        normalized[v] = { labels: raw.labels ?? [], data: raw.data ?? [] };
      } else {
        normalized[v] = { labels: [], data: [] };
      }
    });
    setSeries(normalized);
  }, [initialSeries]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (typeof loadData === "function") {
          const next = await loadData(account);
          if (alive && next) {
            // loadData is expected to return { MoM: {labels,data}, YoY: {...}, QoQ: {...} }
            // but normalize any arrays just in case
            const normalized = {};
            ["MoM", "YoY", "QoQ"].forEach((v) => {
              const raw = next[v];
              if (Array.isArray(raw)) {
                normalized[v] = raw[0] ? { labels: raw[0].labels ?? [], data: raw[0].data ?? [] } : { labels: [], data: [] };
              } else if (raw && typeof raw === "object") {
                normalized[v] = { labels: raw.labels ?? [], data: raw.data ?? [] };
              } else {
                normalized[v] = { labels: [], data: [] };
              }
            });
            setSeries(normalized);
          }
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
export default function DepositLoan({ filterdDepositLoans, filterdtLoansOutstanding }) {

  // helper to get view object whether fallback provides array or object
  const extractView = (fallback, view) => {
    if (!fallback) return { labels: [], data: [] };
    const raw = fallback[view];
    if (Array.isArray(raw)) {
      return raw[0] ? { labels: raw[0].labels ?? [], data: raw[0].data ?? [] } : { labels: [], data: [] };
    }
    if (raw && typeof raw === "object") {
      return { labels: raw.labels ?? [], data: raw.data ?? [] };
    }
    return { labels: [], data: [] };
  };

  // Mock API adapters (handle all views dynamically)
  const loadDeposits = async (account) => {
    if (!filterdDepositLoans) return { MoM: { labels: [], data: [] }, YoY: { labels: [], data: [] }, QoQ: { labels: [], data: [] } };
    const factor = account === "Acc No.2" ? 1.05 : account === "Acc No.3" ? 0.95 : 1;

    const updatedSeries = {};
    ["MoM", "YoY", "QoQ"].forEach((view) => {
      const viewObj = extractView(filterdDepositLoans, view);
      updatedSeries[view] = {
        labels: viewObj.labels,
        data: (viewObj.data || []).map((v) => +(v * factor).toFixed(2)),
      };
    });
    return updatedSeries;
  };

  const loadLoans = async (account) => {
    if (!filterdtLoansOutstanding) return { MoM: { labels: [], data: [] }, YoY: { labels: [], data: [] }, QoQ: { labels: [], data: [] } };
    const factor = account === "Acc No.2" ? 0.95 : account === "Acc No.3" ? 1.08 : 1;

    const updatedSeries = {};
    ["MoM", "YoY", "QoQ"].forEach((view) => {
      const viewObj = extractView(filterdtLoansOutstanding, view);
      updatedSeries[view] = {
        labels: viewObj.labels,
        data: (viewObj.data || []).map((v) => +(v * factor).toFixed(2)),
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
            initialSeries={filterdDepositLoans}
            defaultAccount="Acc No.1"
          />
        </div>
        <div className={classes.col}>
          <TrendCard
            title="Loan Outstanding Trends"
            yTitle="Loan Outstanding"
            rightAxis={false}
            loadData={loadLoans}
            initialSeries={filterdtLoansOutstanding}
            defaultAccount="Acc No.1"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------- PropTypes -------------------- */

DepositLoan.propTypes = {
   filterdDepositLoans: PropTypes.object.isRequired,
   filterdtLoansOutstanding: PropTypes.object.isRequired
};
TrendHeader.propTypes = {
  title: PropTypes.string.isRequired,
  view: PropTypes.oneOf(["YoY", "MoM", "QoQ"]).isRequired,
  onViewChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  onAccountChange: PropTypes.func.isRequired,
};

const singleViewShape = PropTypes.shape({
  labels: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.number),
});

TrendCard.propTypes = {
  title: PropTypes.string.isRequired,
  yTitle: PropTypes.string.isRequired,
  rightAxis: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  // initialSeries can be either the old object { MoM: {labels,data} } OR the new array form [ {clientId, labels, data}, ... ]
  initialSeries: PropTypes.objectOf(
    PropTypes.oneOfType([
      singleViewShape,
      PropTypes.arrayOf(PropTypes.shape({
        clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        labels: PropTypes.arrayOf(PropTypes.string),
        data: PropTypes.arrayOf(PropTypes.number),
      }))
    ])
  ),
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
