import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  homeScreenData: null,
  homeSummary: null,
  insightDetails: [
        {
            "insight_id": "756",
            "data": [
                {
                    "business_classification": "LC",
                    "legal_structure": "Corporation",
                    "industry_segment": " Crop Production",
                    "unused_fx": 0,
                    "unused_capital_market_services": 0,
                    "unused_trade_finance": 0,
                    "unused_treasury_management": "0",
                    "total_clients": 1,
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Corporation - Crop Production",
                    "anomaly_details": {
                        "visual_title": "Treasury Management Unused for LC-Corporation-Crop Production",
                        "brief": "Treasury management services were not utilized by the single client in LC - Corporation - Crop Production, a trend consistent with most business segments except for Advertising, Public Relations, and Related Services where 4 clients did not use this service. This represents zero unavailed services for this group, standing apart from higher gaps in other segments.",
                        "key_highlights": [
                            {
                                "title": "Zero Unused Services",
                                "highlight": "Client in LC - Corporation - Crop Production had no unavailed treasury management services."
                            },
                            {
                                "title": "Segment Comparison",
                                "highlight": "Unavailed count here is 4x lower than in Advertising/Public Relations (where 4 clients missed the service)."
                            },
                            {
                                "title": "Business Classification Consistency",
                                "highlight": "LC business clients show generally low unused treasury management, outside the single spike in Advertising."
                            }
                        ],
                        "recommendations": [
                            "Maintain ongoing engagement to reinforce treasury management adoption for LC - Corporation - Crop Production clients.",
                            "Leverage segment success to design outreach for segments showing high unused service counts, like Advertising/Public Relations.",
                            "Document best practices in treasury management cross-sell for replication across S-Corp and Sole Proprietorship groups.",
                            "Monitor changes in service usage quarterly to spot emerging risks or new cross-sell opportunities early."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Corporation - Crop Production\",\n      \"LC - S-Corp - Offices of Physicians\",\n      \"LC - Sole Proprietorship - Advertising, Public Relations, and Related Services\",\n      \"LC - Sole Proprietorship - Utilities\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Unused Treasury Management\",\n        \"data\": [\n          0,\n          0,\n          4,\n          0\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"borderWidth\": [\n          2,\n          2,\n          3,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"darkred\",\n          \"gold\"\n        ],\n        \"barPercentage\": 0.7,\n        \"categoryPercentage\": 0.7\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { const idx = context.dataIndex; const label = context.chart.data.labels[idx]; const value = context.parsed.y; if (idx === 0) { return label + ': ' + value + ' (Data Point)'; } if (idx === 2) { return label + ': ' + value + ' (Anomalous Data Point)'; } return label + ': ' + value; }\"\n        },\n        \"backgroundColor\": \"rgba(255,255,255,0.95)\",\n        \"titleColor\": \"#333\",\n        \"bodyColor\": \"#000\",\n        \"borderColor\": \"#ccc\",\n        \"borderWidth\": 1\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Business Category\"\n        },\n        \"ticks\": {\n          \"autoSkip\": false,\n          \"maxRotation\": 30,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Unused Treasury Management\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 5,\n        \"ticks\": {\n          \"stepSize\": 1,\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                },
                {
                    "business_classification": "LC",
                    "legal_structure": "S-Corp",
                    "industry_segment": " Offices of Physicians",
                    "unused_fx": 0,
                    "unused_capital_market_services": 0,
                    "unused_trade_finance": 5,
                    "unused_treasury_management": "0",
                    "total_clients": 1,
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - S-Corp - Offices of Physicians",
                    "anomaly_details": {
                        "visual_title": "Unused Treasury Top in Physicians S-Corp",
                        "brief": "Unused Treasury Management services are at 0 for LC - S-Corp - Offices of Physicians, matching the segment average but lower compared to peers like Advertising Services. This stable usage rate suggests limited cross-sell gaps, helping focus efforts elsewhere.",
                        "key_highlights": [
                            {
                                "title": "Treasury Utilization Uniformity",
                                "highlight": "LC - S-Corp - Offices of Physicians reports 0 unused Treasury Management, aligned with 75% of peer segments."
                            },
                            {
                                "title": "Industry Contrast",
                                "highlight": "Advertising/Public Relations Sole Proprietorships show 4 unused Treasury Management, 4x higher than Physicians S-Corp."
                            },
                            {
                                "title": "Cross-Sell Opportunity",
                                "highlight": "Trade Finance remains notably unutilized (5) in Physicians S-Corp despite full Treasury Management uptake."
                            },
                            {
                                "title": "Segment Specific Stability",
                                "highlight": "All S-Corp Physician clients consistently leverage Treasury Management versus more variable service gaps across other industries."
                            }
                        ],
                        "recommendations": [
                            "Leverage the strong Treasury Management adoption to introduce Trade Finance solutions to Physicians S-Corp clients.",
                            "Shift outreach toward segments with higher unavailed services (like Advertising/Public Relations) for immediate cross-sell gains.",
                            "Coordinate with product specialists to bundle Trade Finance and Capital Market offerings where Treasury usage is strong.",
                            "Monitor industry segment patterns quarterly to flag emerging gaps and cross-selling windows proactively."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Corporation - Crop Production\",\n      \"LC - S-Corp - Offices of Physicians\",\n      \"LC - Sole Proprietorship - Advertising, Public Relations, and Related Services\",\n      \"LC - Sole Proprietorship - Utilities\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Unused Treasury Management\",\n        \"data\": [\n          0,\n          0,\n          4,\n          0\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"rgba(187, 128, 45, 0.6)\",\n          \"rgba(187, 128, 45, 0.6)\",\n          \"rgba(220, 38, 54, 0.7)\",\n          \"rgba(187, 128, 45, 0.6)\"\n        ],\n        \"borderWidth\": [\n          1,\n          3,\n          3,\n          1\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"salmon\",\n          \"gold\"\n        ],\n        \"barThickness\": 30\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.parsed.y; var anomalousIdx = 2 - 1; if(idx === anomalousIdx) { return 'Data Point: ' + val; } else if(idx === 2) { return 'Anomalous Data Point (Negative): ' + val; } else { return 'Value: ' + val; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Classification - Legal Structure - Industry Segment\"\n        },\n        \"ticks\": {\n          \"autoSkip\": false,\n          \"maxRotation\": 38,\n          \"minRotation\": 0,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Unused Treasury Management\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 5,\n        \"ticks\": {\n          \"stepSize\": 1,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(200,200,200,0.18)\"\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                },
                {
                    "business_classification": "LC",
                    "legal_structure": "Sole Proprietorship",
                    "industry_segment": " Advertising, Public Relations, and Related Services",
                    "unused_fx": 0,
                    "unused_capital_market_services": 4,
                    "unused_trade_finance": 0,
                    "unused_treasury_management": "4",
                    "total_clients": 1,
                    "anomaly_type": "negative",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Sole Proprietorship - Advertising, Public Relations, and Related Services",
                    "anomaly_details": {
                        "visual_title": "Treasury Management Unused 4x Above Mean",
                        "brief": "In the 'LC - Sole Proprietorship - Advertising, Public Relations, and Related Services' segment, the count of unused treasury management services reached 4—three times higher than the dataset mean of 1. This negative anomaly suggests substantial cross-sell potential for the Sales Relationship Manager in this segment.",
                        "key_highlights": [
                            {
                                "title": "Segment Outlier",
                                "highlight": "This segment shows 4 unused services versus the dataset average of 1, a 3x deviation."
                            },
                            {
                                "title": "Business Classification",
                                "highlight": "Sole Proprietorships in this segment lag notably behind peers in treasury product adoption."
                            },
                            {
                                "title": "Cross-Sell Opportunity",
                                "highlight": "All four major treasury services remain unavailed by this client, indicating a gap in coverage."
                            }
                        ],
                        "recommendations": [
                            "Prioritize targeted outreach to discuss the value and ROI of treasury management services with this client.",
                            "Collaborate with product specialists to design tailored bundled offers specifically for advertising/public relations businesses.",
                            "Schedule a needs-based review meeting to uncover barriers to treasury service adoption.",
                            "Monitor similar sole proprietorships for unavailed services and scale successful engagement strategies."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Corporation - Crop Production\",\n      \"LC - S-Corp - Offices of Physicians\",\n      \"LC - Sole Proprietorship - Advertising, Public Relations, and Related Services\",\n      \"LC - Sole Proprietorship - Utilities\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Unused Treasury Management\",\n        \"data\": [0, 0, 4, 0],\n        \"borderColor\": \"#888\",\n        \"backgroundColor\": \"rgba(200,200,200,0.15)\",\n        \"pointBorderColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"pointBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"pointRadius\": [5,5,10,5],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"star\",\n          \"circle\"\n        ],\n        \"borderWidth\": 2,\n        \"lineTension\": 0.3,\n        \"fill\": false\n      },\n      {\n        \"label\": \"Mean (Reference Line)\",\n        \"data\": [1,1,1,1],\n        \"type\": \"line\",\n        \"borderDash\": [6,4],\n        \"borderColor\": \"#AAA\",\n        \"pointRadius\": 0,\n        \"pointBackgroundColor\": \"rgba(0,0,0,0)\",\n        \"fill\": false,\n        \"borderWidth\": 1\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"font\": {\n            \"size\": 11\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var value = context.parsed.y; var labels = context.chart.data.labels; if(idx === 2) { return labels[idx] + ': ' + value + ' (Anomalous Data Point: Negative)'; } else { return labels[idx] + ': ' + value + ' (Data Point)'; } }\"\n        },\n        \"backgroundColor\": \"rgba(255,255,255,0.95)\",\n        \"titleColor\": \"#111\",\n        \"bodyColor\": \"#111\",\n        \"borderColor\": \"#ddd\",\n        \"borderWidth\": 1\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Segment\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 11\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Unused Treasury Management\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"min\": 0,\n        \"max\": 4.5,\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 11\n          },\n          \"stepSize\": 1\n        }\n      }\n    },\n    \"elements\": {\n      \"line\": {\n        \"borderWidth\": 2\n      },\n      \"point\": {\n        \"borderWidth\": 2\n      }\n    },\n    \"responsive\": true,\n    \"maintainAspectRatio\": false\n  }\n}",
                        "value": "4"
                    }
                },
                {
                    "business_classification": "LC",
                    "legal_structure": "Sole Proprietorship",
                    "industry_segment": " Utilities",
                    "unused_fx": 0,
                    "unused_capital_market_services": 0,
                    "unused_trade_finance": 0,
                    "unused_treasury_management": "0",
                    "total_clients": 1,
                    "anomaly_type": "normal",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Sole Proprietorship - Utilities",
                    "anomaly_details": {
                        "visual_title": "Zero Treasury Management Unused in Utilities",
                        "brief": "For LC - Sole Proprietorship - Utilities, unused treasury management was 0, matching the segment average and indicating full utilization. This contrasts with other sole proprietorships where unavailed service counts are notably higher.",
                        "key_highlights": [
                            {
                                "title": "Full Utilization",
                                "highlight": "Treasury Management was fully utilized, 0 unavailed versus segment average of 1."
                            },
                            {
                                "title": "Sector Contrast",
                                "highlight": "Unlike advertising and PR clients (unused 4), utilities show no gaps in treasury usage."
                            },
                            {
                                "title": "Role Fit",
                                "highlight": "Utilities sole proprietorships may be more engaged with banking solutions compared to other industries."
                            }
                        ],
                        "recommendations": [
                            "Leverage high engagement in utilities to model proactive outreach in lower-utilization segments.",
                            "Identify practices from utility clients to replicate for sole proprietorships with higher unavailed counts.",
                            "Offer testimonials from utilities on treasury management value to encourage adoption elsewhere.",
                            "Review periodic client meetings to spot emerging needs for cross-sell opportunities."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Corporation - Crop Production\",\n      \"LC - S-Corp - Offices of Physicians\",\n      \"LC - Sole Proprietorship - Advertising, Public Relations, and Related Services\",\n      \"LC - Sole Proprietorship - Utilities\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Unused Treasury Management\",\n        \"data\": [\n          0,\n          0,\n          4,\n          0\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"red\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"rgba(255,165,0,1)\",\n          \"rgba(255,165,0,1)\",\n          \"rgba(255,0,0,1)\",\n          \"rgba(255,165,0,1)\"\n        ],\n        \"borderWidth\": [\n          1,\n          1,\n          3,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(255,200,0,0.7)\",\n          \"rgba(255,200,0,0.7)\",\n          \"rgba(255,50,50,0.7)\",\n          \"rgba(255,200,0,0.7)\"\n        ]\n      },\n      {\n        \"label\": \"Average\",\n        \"data\": [\n          1,\n          1,\n          1,\n          1\n        ],\n        \"type\": \"line\",\n        \"fill\": false,\n        \"borderColor\": \"rgba(100,100,100,0.5)\",\n        \"borderWidth\": 1,\n        \"pointRadius\": 0,\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"filter\": \"function(legendItem, chartData) { return legendItem.text !== undefined; }\",\n          \"color\": \"#444\"\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx=context.dataIndex; var val=context.parsed.y; var label=context.chart.data.labels[idx]; var anomaly=['normal','positive','negative'][idx]; if (label==='LC - Sole Proprietorship - Utilities') { if (anomaly==='normal') return 'Data Point: ' + val + ' (unused treasury management)'; else return (anomaly==='positive'?'Anomalous (Positive)':'Anomalous (Negative)') + ': ' + val; } if (anomaly==='negative') return 'Anomalous (Negative): ' + val; if (anomaly==='positive') return 'Anomalous (Positive): ' + val; return 'Value: ' + val; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Segment\",\n          \"color\": \"#666\",\n          \"font\": {\n            \"weight\": \"bold\"\n          }\n        },\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"maxRotation\": 30,\n          \"minRotation\": 0,\n          \"autoSkip\": false\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Unused Treasury Management\",\n          \"color\": \"#666\",\n          \"font\": {\n            \"weight\": \"bold\"\n          }\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 5,\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"precision\": 0\n        },\n        \"grid\": {\n          \"color\": \"rgba(220,220,220,0.3)\",\n          \"lineWidth\": 1,\n          \"drawBorder\": true\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": 5\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                }
            ]
        },
        {
            "insight_id": "759",
            "data": [
                {
                    "client_industry": "1111",
                    "business_classification": "LC",
                    "legal_structure": "Corporation",
                    "inactive_client_count": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "1111 - LC - Corporation",
                    "anomaly_details": {
                        "visual_title": "Inactive Clients Stable in 1111 - LC",
                        "brief": "Inactive client count remained at 1 for '1111 - LC - Corporation', matching peer segments with no spike or drop seen. All compared segments consistently show minimal disengagement risk at this time.",
                        "key_highlights": [
                            {
                                "title": "Peer Comparison",
                                "highlight": "'1111 - LC - Corporation' inactive clients count equals other analyzed segments (1 vs. 1 baseline)."
                            },
                            {
                                "title": "No Anomaly Detected",
                                "highlight": "Inactive client count shows no deviation from overall dataset mean or pattern."
                            },
                            {
                                "title": "Low Attrition Risk",
                                "highlight": "The data suggests low current disengagement across all legal structures and industries reviewed."
                            }
                        ],
                        "recommendations": [
                            "Maintain current client engagement strategies, as inactivity levels are low and stable.",
                            "Monitor monthly activity trends to detect early signals if count rises above the baseline.",
                            "Continue proactive outreach to keep all clients active, ensuring this positive trend persists.",
                            "Leverage segmentation to quickly catch any upticks in inactivity within specific industries or business classifications."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"1111 - LC - Corporation\",\n      \"2211 - LC - Sole Proprietorship\",\n      \"5418 - LC - Sole Proprietorship\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Inactive Client Count\",\n        \"data\": [1, 1, 1],\n        \"backgroundColor\": [\n          \"orange\",\n          \"lightgray\",\n          \"lightgray\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"lightgray\",\n          \"lightgray\"\n        ],\n        \"borderWidth\": [\n          3,\n          1,\n          1\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"silver\",\n          \"silver\"\n        ],\n        \"barThickness\": 38\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 0) { return 'Data Point: ' + context.parsed.y; } else { return 'Inactive Client Count: ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Industry / Classification / Structure\"\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Inactive Client Count\"\n        },\n        \"min\": 0,\n        \"max\": 2,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(220,220,220,0.2)\"\n        },\n        \"ticks\": {\n          \"stepSize\": 1\n        }\n      }\n    }\n  }\n}",
                        "value": "1"
                    }
                },
                {
                    "client_industry": "2211",
                    "business_classification": "LC",
                    "legal_structure": "Sole Proprietorship",
                    "inactive_client_count": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "2211 - LC - Sole Proprietorship",
                    "anomaly_details": {
                        "visual_title": "Inactive Client Count Flat in 2211 Segment",
                        "brief": "The inactive client count for '2211 - LC - Sole Proprietorship' remained at 1, mirroring both peer segments. There is no statistical spike or drop, indicating stable disengagement levels for this client industry and legal structure.",
                        "key_highlights": [
                            {
                                "title": "No Segment Variation",
                                "highlight": "All segments show an inactive client count of 1, with zero deviation across groupings."
                            },
                            {
                                "title": "Consistent Legal Structure",
                                "highlight": "Both Sole Proprietorship and Corporation legal structures had identical inactive rates among LC clients."
                            },
                            {
                                "title": "Low Absolute Risk",
                                "highlight": "Inactive client count represents 1 per segment, minimizing immediate attrition risk for the Sales Relationship Manager."
                            }
                        ],
                        "recommendations": [
                            "Monitor for future increases in inactivity within Sole Proprietorship clients to detect early disengagement patterns.",
                            "Review cross-selling and engagement tactics uniformly across all LC client segments, given the consistent inactivity.",
                            "Set up automated alerts if inactive client count rises above baseline to enable timely outreach.",
                            "Collaborate with product teams to ensure service offerings remain relevant for small LC clients."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"1111 - LC - Corporation\",\n      \"2211 - LC - Sole Proprietorship\",\n      \"5418 - LC - Sole Proprietorship\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Inactive Client Count\",\n        \"data\": [1, 1, 1],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"borderWidth\": [\n          2,\n          4,\n          2\n        ],\n        \"borderColor\": [\n          \"rgba(255,165,0,0.5)\",\n          \"rgba(255,165,0,1)\",\n          \"rgba(255,165,0,0.5)\"\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"gold\"\n        ],\n        \"barPercentage\": 0.8,\n        \"categoryPercentage\": 0.7\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 1) { return 'Data Point: ' + context.dataset.data[context.dataIndex]; } else { return 'Inactive Client Count: ' + context.dataset.data[context.dataIndex]; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client / Legal Structure\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Inactive Client Count\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 2,\n        \"ticks\": {\n          \"stepSize\": 1\n        },\n        \"grid\": {\n          \"color\": \"#f0f0f0\"\n        }\n      }\n    }\n  }\n}",
                        "value": "1"
                    }
                },
                {
                    "client_industry": "5418",
                    "business_classification": "LC",
                    "legal_structure": "Sole Proprietorship",
                    "inactive_client_count": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "5418 - LC - Sole Proprietorship",
                    "anomaly_details": {
                        "visual_title": "Inactive Clients Stable in Industry 5418",
                        "brief": "Inactive client count for Sole Proprietorships in industry 5418 remains unchanged at 1, matching sector peers. The rate shows no deviation within comparable business classifications this period.",
                        "key_highlights": [
                            {
                                "title": "Consistent with Peers",
                                "highlight": "Inactive client count is identical (1) across all analyzed industry profiles and structures."
                            },
                            {
                                "title": "No Recent Spike",
                                "highlight": "The current count shows no increase compared to previous industry and classification group averages."
                            },
                            {
                                "title": "Client Engagement Level",
                                "highlight": "All surveyed LC Sole Proprietorships report equally low inactivity, suggesting stable client relationships."
                            }
                        ],
                        "recommendations": [
                            "Monitor client engagement trends for this segment to detect early shifts in inactivity.",
                            "Maintain regular re-engagement outreach despite stable inactivity, ensuring issues are addressed proactively.",
                            "Leverage consistent engagement metrics to benchmark and refine cross-selling campaigns targeting similar client profiles.",
                            "Collaborate with operations to preempt service bottlenecks before inactivity levels change."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"1111 - LC - Corporation\",\n      \"2211 - LC - Sole Proprietorship\",\n      \"5418 - LC - Sole Proprietorship\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Inactive Client Count\",\n        \"data\": [\n          1,\n          1,\n          1\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"rgba(120,120,120,0.2)\",\n          \"rgba(120,120,120,0.2)\",\n          \"rgba(255,165,0,1)\"\n        ],\n        \"borderWidth\": [\n          1,\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"gold\"\n        ]\n      },\n      {\n        \"type\": \"line\",\n        \"label\": \"Average\",\n        \"data\": [\n          1,\n          1,\n          1\n        ],\n        \"fill\": false,\n        \"borderColor\": \"rgba(90,90,90,0.4)\",\n        \"borderDash\": [4, 2],\n        \"pointRadius\": 0,\n        \"pointStyle\": \"line\",\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"usePointStyle\": true,\n          \"padding\": 15\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 2) { return 'Data Point: ' + context.dataset.data[context.dataIndex]; } else { return 'Inactive Client Count: ' + context.dataset.data[context.dataIndex]; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Profile\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Inactive Client Count\"\n        },\n        \"min\": 0,\n        \"max\": 2,\n        \"ticks\": {\n          \"stepSize\": 1\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false,\n          \"color\": \"rgba(220,220,220,0.35)\"\n        }\n      }\n    }\n  }\n}",
                        "value": "1"
                    }
                }
            ]
        },
        {
            "insight_id": "754",
            "data": [
                {
                    "RAROC_Group": "Below_Median",
                    "Percent_Strong_External_Credit_Rating": "0.333 x 10⁰",
                    "Avg_Internal_Obligor_Risk_Rating": 5.5,
                    "Percent_Defaulted": 0,
                    "Percent_Covenant_Breach": 0,
                    "Percent_Bankruptcy_Filed": 0,
                    "Avg_Maximum_Days_Passed_Due": 0,
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Data Point 1",
                    "anomaly_details": {
                        "visual_title": "Strong Credit Rating 3x Higher in Below Median RAROC",
                        "brief": "Data Point 1 shows a 33% strong external credit rating—three times higher than its nearest peer in the Below Median RAROC group. This stands out in a segment typically associated with weaker credit profiles.",
                        "key_highlights": [
                            {
                                "title": "Peer Comparison",
                                "highlight": "Data Point 1 has a 0.333 strong credit rating, while Data Point 2 shows zero—making it 3x higher than the next row."
                            },
                            {
                                "title": "RAROC Group Context",
                                "highlight": "Despite being in the Below Median RAROC group, Data Point 1 displays unexpectedly robust external credit quality."
                            },
                            {
                                "title": "Portfolio Risk Implication",
                                "highlight": "No defaults, covenant breaches, or bankruptcies registered for Data Point 1, supporting its high credit rating profile."
                            }
                        ],
                        "recommendations": [
                            "Prioritize retaining and expanding relationships with clients exhibiting strong external credit ratings, even when overall RAROC is below median.",
                            "Analyze deal structures for clients like Data Point 1 to identify replicable factors contributing to improved external ratings.",
                            "Collaborate with credit analysts to segment and target similar high-credit prospects in other lower RAROC groups.",
                            "Leverage client success stories to inform refinements in pre-loan assessment and onboarding criteria for future portfolio growth."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Data Point 1\",\n      \"Data Point 2\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Percent Strong External Credit Rating\",\n        \"data\": [0.333, 0],\n        \"backgroundColor\": [\n          \"orange\",\n          \"rgba(180,180,180,0.4)\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"rgba(180,180,180,0.6)\"\n        ],\n        \"borderWidth\": [\n          3,\n          1\n        ],\n        \"barPercentage\": 0.6,\n        \"categoryPercentage\": 0.7\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 0) { return 'Data Point (normal): ' + context.parsed.y; } else { return 'Data Point: ' + context.parsed.y; } }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Percent Strong External Credit Rating Comparison\",\n        \"font\": {\n          \"size\": 16\n        }\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Percent Strong External Credit Rating\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 0.35,\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"stepSize\": 0.05,\n          \"callback\": \"function(value) { return value.toFixed(2); }\"\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"RAROC Group\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "0.333 x 10⁰"
                    }
                },
                {
                    "RAROC_Group": "Above_Median",
                    "Percent_Strong_External_Credit_Rating": "0",
                    "Avg_Internal_Obligor_Risk_Rating": "Cod",
                    "Percent_Defaulted": 0,
                    "Percent_Covenant_Breach": 0,
                    "Percent_Bankruptcy_Filed": 0,
                    "Avg_Maximum_Days_Passed_Due": "Cod",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Data Point 2",
                    "anomaly_details": {
                        "visual_title": "Strong Credit Rating Fell to 0% Above Median",
                        "brief": "In Data Point 2 ('Above_Median' RAROC Group), the percent of clients with strong external credit ratings dropped to 0%, a full reduction versus the 33.3% observed in the 'Below_Median' group. This reversal may impact risk-adjusted returns and future portfolio quality for the relationship manager.",
                        "key_highlights": [
                            {
                                "title": "Zero Top-Rated Clients",
                                "highlight": "No clients in the Above_Median segment have strong external credit ratings (0%), versus 33.3% in Below_Median."
                            },
                            {
                                "title": "RAROC Segment Paradox",
                                "highlight": "Despite being Above_Median for RAROC, this group has the weakest external credit profile among both segments."
                            },
                            {
                                "title": "Risk Concentration",
                                "highlight": "Absence of high-credit-quality clients may increase exposure to portfolio volatility and risk events."
                            }
                        ],
                        "recommendations": [
                            "Prioritize acquiring or retaining clients with strong external credit ratings to enhance portfolio resilience in the Above_Median group.",
                            "Review deal structures and risk-adjusted pricing for clients lacking external credit strength to safeguard future RAROC levels.",
                            "Coordinate with credit analysts to reassess risk ratings and proactively manage segments with no credit-positive representation.",
                            "Initiate periodic client credit reviews to identify rising risks and address gaps before they affect relationship profitability."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Data Point 1 (Below_Median)\",\n      \"Data Point 2 (Above_Median)\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Percent Strong External Credit Rating\",\n        \"data\": [\n          0.333,\n          0\n        ],\n        \"backgroundColor\": [\n          \"rgba(255, 193, 7, 0.85)\",\n          \"rgba(255, 193, 7, 1)\"\n        ],\n        \"borderColor\": [\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          4\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\"\n        ],\n        \"hoverBorderColor\": [\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 1) { return 'Data Point (Anomalous: normal): ' + context.parsed.y; } else { return 'Data Point: ' + context.parsed.y; } }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Percent Strong External Credit Rating by RAROC_Group\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"RAROC Group\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Percent Strong External Credit Rating\"\n        },\n        \"min\": 0,\n        \"max\": 0.4,\n        \"ticks\": {\n          \"stepSize\": 0.1\n        },\n        \"grid\": {\n          \"display\": true\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                }
            ]
        },
        {
            "insight_id": "761",
            "data": [
                {
                    "business_classification": "LC",
                    "client_type": "Existing",
                    "meeting_count": "9",
                    "engagement_share": 0.75,
                    "segment_engagement_status": "Highest Engagement",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Existing",
                    "anomaly_details": {
                        "visual_title": "Meeting Count Tripled for LC Existing",
                        "brief": "The LC - Existing client segment logged 9 meetings, 3x higher than the LC - Prospect segment over this period. This substantial activity indicates exceptional engagement with current clients compared to prospects.",
                        "key_highlights": [
                            {
                                "title": "Engagement Lead",
                                "highlight": "LC - Existing accounts show the highest engagement share at 0.75 versus 0.25 for prospects."
                            },
                            {
                                "title": "Relative Volume",
                                "highlight": "Meeting count for LC - Existing is 200% higher than the next segment (9 vs 3)."
                            },
                            {
                                "title": "Segment Context",
                                "highlight": "Existing LC clients outperform prospects in both frequency and engagement status, indicating a strong relationship management focus."
                            }
                        ],
                        "recommendations": [
                            "Analyze drivers behind high engagement with LC - Existing to replicate success with prospects.",
                            "Prioritize outreach programs and tailored follow-ups for LC - Prospect clients to boost meeting frequency.",
                            "Review meeting content and outcomes for LC - Existing clients to identify top-performing strategies.",
                            "Evaluate resource allocation between segments to ensure prospects receive sufficient relationship-building attention."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Existing\",\n      \"LC - Prospect\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Meeting Count\",\n        \"data\": [\n          9,\n          3\n        ],\n        \"backgroundColor\": [\n          \"#FFA500\",\n          \"#FFD580\"\n        ],\n        \"borderColor\": [\n          \"#FFA500\",\n          \"#FFD580\"\n        ],\n        \"borderWidth\": [\n          3,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"#FFC04D\",\n          \"#FFE099\"\n        ],\n        \"hoverBorderColor\": [\n          \"#FFA500\",\n          \"#FFD580\"\n        ],\n        \"borderSkipped\": false\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 0) { return 'Data Point: ' + context.parsed.y + ' meetings'; } else { return 'Meeting Count: ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Business Classification / Client Type\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Meeting Count\"\n        },\n        \"min\": 0,\n        \"max\": 10,\n        \"ticks\": {\n          \"stepSize\": 1\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"backgroundColor\": \"#FFA500\",\n        \"borderWidth\": 3,\n        \"borderRadius\": 4\n      }\n    }\n  }\n}",
                        "value": "9"
                    }
                },
                {
                    "business_classification": "LC",
                    "client_type": "Prospect",
                    "meeting_count": "3",
                    "engagement_share": 0.25,
                    "segment_engagement_status": "",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Prospect",
                    "anomaly_details": {
                        "visual_title": "Meeting Count Dropped 67% for LC Prospect",
                        "brief": "The LC - Prospect client type had only 3 meetings, 67% lower than LC - Existing which had 9. This drop in engagement highlights an opportunity for increased outreach to prospects.",
                        "key_highlights": [
                            {
                                "title": "Low Prospect Engagement",
                                "highlight": "LC - Prospect segment recorded 3 meetings, far fewer than existing clients."
                            },
                            {
                                "title": "Benchmark Comparison",
                                "highlight": "Prospect meetings are 3x lower than the LC - Existing segment average."
                            },
                            {
                                "title": "Engagement Share Gap",
                                "highlight": "Prospects had only 0.25 engagement share versus 0.75 for existing clients."
                            }
                        ],
                        "recommendations": [
                            "Schedule additional meetings to strengthen engagement with LC prospects and improve relationship-building.",
                            "Review the outreach strategy for prospects and leverage CRM data to identify high-potential targets.",
                            "Coordinate with product teams to tailor meetings for prospect needs, increasing meeting effectiveness.",
                            "Monitor prospect segment for future anomalies and reassess meeting allocation strategy quarterly."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC - Existing\",\n      \"LC - Prospect\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Meeting Count\",\n        \"data\": [\n          9,\n          3\n        ],\n        \"backgroundColor\": [\n          \"rgba(255, 191, 0, 0.7)\",\n          \"rgba(255, 191, 0, 1)\"\n        ],\n        \"borderColor\": [\n          \"rgba(255, 191, 0, 1)\",\n          \"rgba(255, 191, 0, 1)\"\n        ],\n        \"borderWidth\": [\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(255, 191, 0, 0.9)\",\n          \"rgba(255, 191, 0, 1)\"\n        ],\n        \"hoverBorderColor\": [\n          \"rgba(255, 191, 0, 1)\",\n          \"rgba(255, 191, 0, 1)\"\n        ],\n        \"barPercentage\": 0.5\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 1) { return 'Data Point: LC - Prospect\\\\nMeeting Count: 3'; } else { return 'LC - Existing\\\\nMeeting Count: 9'; } }\"\n        },\n        \"backgroundColor\": \"rgba(40,40,40,0.85)\",\n        \"borderWidth\": 1,\n        \"borderColor\": \"#bbb\",\n        \"titleColor\": \"#fff\",\n        \"bodyColor\": \"#fff\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Type\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Meeting Count\"\n        },\n        \"min\": 0,\n        \"max\": 10,\n        \"ticks\": {\n          \"stepSize\": 1\n        },\n        \"grid\": {\n          \"drawBorder\": true,\n          \"color\": \"rgba(230,230,230,0.2)\"\n        }\n      }\n    }\n  }\n}",
                        "value": "3"
                    }
                }
            ]
        },
        {
            "insight_id": "751",
            "data": [
                {
                    "Month": "2024-12",
                    "business_classification": "LC",
                    "Avg_Deposit_Balance": "44.095 x 10⁴",
                    "Total_Growth": 246011.03,
                    "anomaly_type": "positive",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Dec '24",
                    "anomaly_details": {
                        "visual_title": "LC Average Deposit Balance Surged in Dec '24",
                        "brief": "In December 2024, LC's average deposit balance reached 440,950, marking a 2.26x increase over the cohort mean. This positive anomaly stands out compared to the subsequent months where balances normalized, offering a strong liquidity position for the business segment.",
                        "key_highlights": [
                            {
                                "title": "Significant Outperformance",
                                "highlight": "December's average deposit balance (440,950) was 47% higher than the segment trendline mean (299,744)."
                            },
                            {
                                "title": "Persistent Peak",
                                "highlight": "Both Dec '24 and Mar '25 exhibited the same high average balance prior to a sharp drop in May."
                            },
                            {
                                "title": "Business Liquidity Impact",
                                "highlight": "Elevated balances suggest stronger client liquidity or successful cash concentration initiatives within the LC classification."
                            }
                        ],
                        "recommendations": [
                            "Analyze client inflows in LC for December to identify key transactions or events driving the spike.",
                            "Engage top contributors in December for potential upsell of treasury and cash concentration services.",
                            "Review product offerings and pricing strategies that may have incentivized higher balances during the anomalous period.",
                            "Monitor for sustainability—track Q1 deposit trends to proactively address emerging balance declines in LC clients."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\"Dec-24\", \"Mar-25\", \"May-25\", \"Jun-25\", \"Jul-25\"],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Deposit Balance (LC)\",\n        \"data\": [440950, 440950, 194940, 194940, 194940],\n        \"borderColor\": \"#4287f5\",\n        \"backgroundColor\": \"rgba(66,135,245,0.08)\",\n        \"fill\": false,\n        \"tension\": 0.25,\n        \"pointRadius\": [\n          7,\n          5,\n          4,\n          4,\n          4\n        ],\n        \"pointBackgroundColor\": [\n          \"#22c55e\",\n          \"#22c55e\",\n          \"#fbbf24\",\n          \"#fbbf24\",\n          \"#fbbf24\"\n        ],\n        \"pointBorderColor\": [\n          \"#15803d\",\n          \"#15803d\",\n          \"#a16207\",\n          \"#a16207\",\n          \"#a16207\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"triangle\",\n          \"rect\",\n          \"rect\",\n          \"rect\"\n        ]\n      },\n      {\n        \"label\": \"Mean Balance Trend\",\n        \"data\": [299744, 299744, 299744, 299744, 299744],\n        \"borderColor\": \"#bbb\",\n        \"borderDash\": [6, 4],\n        \"pointRadius\": 0,\n        \"backgroundColor\": \"rgba(170,170,170,0.07)\",\n        \"fill\": false,\n        \"tension\": 0.25\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"color\": \"#333\",\n          \"boxWidth\": 16,\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"#fff\",\n        \"titleColor\": \"#333\",\n        \"borderColor\": \"#888\",\n        \"borderWidth\": 1,\n        \"bodyColor\": \"#222\",\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var dps = [440950, 440950]; var anomalousIdxs = [0,1]; if(anomalousIdxs.includes(idx)) { return 'Anomalous Data Point: ' + context.parsed.y.toLocaleString(); } else { return 'Data Point: ' + context.parsed.y.toLocaleString(); } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Month\",\n          \"color\": \"#444\"\n        },\n        \"ticks\": {\n          \"color\": \"#444\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Deposit Balance\",\n          \"color\": \"#444\"\n        },\n        \"min\": 180000,\n        \"max\": 460000,\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"stepSize\": 50000,\n          \"callback\": \"function(value) { return value.toLocaleString(); }\"\n        },\n        \"grid\": {\n          \"drawOnChartArea\": true,\n          \"borderColor\": \"#f5f5f5\"\n        }\n      }\n    }\n  }\n}",
                        "value": "44.095 x 10⁴"
                    }
                },
                {
                    "Month": "2025-03",
                    "business_classification": "LC",
                    "Avg_Deposit_Balance": "44.095 x 10⁴",
                    "Total_Growth": 246011.03,
                    "anomaly_type": "positive",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Mar '25",
                    "anomaly_details": {
                        "visual_title": "Deposit Balances Doubled in Mar ‘25 for LC",
                        "brief": "In March 2025, the Average Deposit Balance for LC clients reached 440,950, over 1.7x higher than the period trend and significantly above subsequent months. This spike presents a key opportunity for deepening client relationships and understanding drivers behind elevated balances.",
                        "key_highlights": [
                            {
                                "title": "Sharp Outlier vs Trend",
                                "highlight": "March ‘25 balance (440,950) is 1.7x above the trendline (259,450) and nearly 2.3x higher than May–Jul averages."
                            },
                            {
                                "title": "Sustained Drop-Off Post March",
                                "highlight": "Balances fell by more than 55% in the following three months, signaling reversion or possibly seasonal client fund movement."
                            },
                            {
                                "title": "Consistent Growth Signal",
                                "highlight": "The anomalous balance matches the previous high in Dec ’24, suggesting targeted actions or events impacting LC segment liquidity."
                            }
                        ],
                        "recommendations": [
                            "Engage LC clients to identify reasons for March’s elevated balances, such as seasonal inflows or ad-hoc deposits.",
                            "Promote treasury and cash optimization solutions to sustain higher deposit levels through the remainder of the year.",
                            "Monitor large withdrawals after March to catch early signs of client churn or changing cash management needs.",
                            "Leverage Mar ‘25 insights to create retention and upsell strategies targeting similar deposit spikes."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"Dec-24\",\n      \"Mar-25\",\n      \"May-25\",\n      \"Jun-25\",\n      \"Jul-25\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Deposit Balance\",\n        \"data\": [\n          440950.0,\n          440950.0,\n          194940.0,\n          194940.0,\n          194940.0\n        ],\n        \"borderColor\": \"rgba(93, 116, 204, 1)\",\n        \"backgroundColor\": \"rgba(93, 116, 204, 0.1)\",\n        \"pointRadius\": [\n          4,\n          8,\n          4,\n          4,\n          4\n        ],\n        \"pointBackgroundColor\": [\n          \"rgba(93, 116, 204, 1)\",\n          \"rgba(44, 204, 93,1)\",\n          \"rgba(255, 159, 64,1)\",\n          \"rgba(255, 159, 64,1)\",\n          \"rgba(255, 159, 64,1)\"\n        ],\n        \"pointBorderColor\": [\n          \"rgba(93, 116, 204, 1)\",\n          \"rgba(22, 100, 32,1)\",\n          \"rgba(243, 128, 32,1)\",\n          \"rgba(243, 128, 32,1)\",\n          \"rgba(243, 128, 32,1)\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\"\n        ],\n        \"borderWidth\": 2,\n        \"tension\": 0.3\n      },\n      {\n        \"label\": \"Average Trend\",\n        \"data\": [\n          259452.0,\n          259452.0,\n          259452.0,\n          259452.0,\n          259452.0\n        ],\n        \"fill\": false,\n        \"borderDash\": [6, 3],\n        \"borderColor\": \"rgba(125, 125, 125, 0.55)\",\n        \"pointRadius\": 0,\n        \"borderWidth\": 1,\n        \"tension\": 0.1\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false,\n        \"labels\": {\n          \"boxWidth\": 14\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"nearest\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) {\\n  const idx = context.dataIndex;\\n  const value = context.parsed.y;\\n  if(idx === 1) {\\n    return 'Anomalous Data Point: ' + value.toLocaleString();\\n  } else if(idx === 0) {\\n    return 'Positive Anomaly: ' + value.toLocaleString();\\n  } else {\\n    return 'Data Point: ' + value.toLocaleString();\\n  }\\n}\",\n          \"title\": \"function(items) {\\n  return items[0].label;\\n}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Month\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Deposit Balance\"\n        },\n        \"min\": 180000,\n        \"max\": 460000,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(230,230,230,1)\"\n        },\n        \"ticks\": {\n          \"callback\": \"function(value) {return value.toLocaleString();}\",\n          \"stepSize\": 50000\n        }\n      }\n    },\n    \"elements\": {\n      \"point\": {\n        \"borderWidth\": 2,\n        \"hoverRadius\": 10\n      }\n    }\n  }\n}",
                        "value": "44.095 x 10⁴"
                    }
                },
                {
                    "Month": "2025-05",
                    "business_classification": "LC",
                    "Avg_Deposit_Balance": "19.494 x 10⁴",
                    "Total_Growth": 246011.03,
                    "anomaly_type": "normal",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - May '25",
                    "anomaly_details": {
                        "visual_title": "Deposit Balances Fell 55.8% in May '25",
                        "brief": "Average deposit balances for LC clients dropped sharply to ₹194,940 in May 2025, down 55.8% versus the previous period’s ₹440,950, marking a significant liquidity shift in this segment.",
                        "key_highlights": [
                            {
                                "title": "Abrupt Balance Drop",
                                "highlight": "May '25 average balances fell 2.26x below prior peak months for LC accounts."
                            },
                            {
                                "title": "Sustained Low Pattern",
                                "highlight": "Deposit levels remained flat at ₹194,940 for three consecutive months after May, suggesting a lasting trend."
                            },
                            {
                                "title": "Business Classification Impact",
                                "highlight": "All affected data points pertain to 'LC' classification, indicating segment-specific liquidity challenges."
                            }
                        ],
                        "recommendations": [
                            "Engage LC segment clients individually to understand drivers behind the sudden drop in deposits.",
                            "Review recent treasury and cash management service uptake among LC accounts post-April to identify missed opportunities.",
                            "Promote consolidation of business accounts and tailored liquidity solutions to boost balances in the LC segment.",
                            "Set up monitoring for early warning on average balance declines and prioritize proactive outreach in low-performing months."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\"Dec-24\", \"Mar-25\", \"May-25\", \"Jun-25\", \"Jul-25\"],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Deposit Balance\",\n        \"data\": [440950, 440950, 194940, 194940, 194940],\n        \"borderColor\": \"#1976D2\",\n        \"backgroundColor\": \"rgba(25, 118, 210, 0.08)\",\n        \"fill\": false,\n        \"pointRadius\": [5, 5, 8, 5, 5],\n        \"pointBackgroundColor\": [\n          \"green\",\n          \"green\",\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"pointBorderColor\": [\n          \"green\",\n          \"green\",\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\"\n        ],\n        \"borderWidth\": 2,\n        \"pointHoverRadius\": [6, 6, 10, 6, 6],\n        \"pointHoverBackgroundColor\": [\n          \"green\",\n          \"green\",\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 2) { return 'Data Point: ' + context.parsed.y.toLocaleString(); } else if(context.dataIndex === 0 || context.dataIndex === 1) { return 'Anomalous Data Point: ' + context.parsed.y.toLocaleString(); } else { return 'Avg Deposit Balance: ' + context.parsed.y.toLocaleString(); } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Month\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Deposit Balance (₹)\"\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(220,220,220,0.15)\"\n        },\n        \"beginAtZero\": false,\n        \"min\": 190000,\n        \"max\": 450000,\n        \"ticks\": {\n          \"callback\": \"function(value) { return '₹' + value.toLocaleString(); }\"\n        }\n      }\n    },\n    \"elements\": {\n      \"point\": {\n        \"borderWidth\": 2,\n        \"radius\": 5\n      },\n      \"line\": {\n        \"borderWidth\": 2\n      }\n    },\n    \"layout\": {\n      \"padding\": {\n        \"top\": 16,\n        \"bottom\": 8,\n        \"left\": 16,\n        \"right\": 16\n      }\n    }\n  }\n}",
                        "value": "19.494 x 10⁴"
                    }
                },
                {
                    "Month": "2025-06",
                    "business_classification": "LC",
                    "Avg_Deposit_Balance": "19.494 x 10⁴",
                    "Total_Growth": 246011.03,
                    "anomaly_type": "normal",
                    "data_point_idx": 5,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Jun '25",
                    "anomaly_details": {
                        "visual_title": "LC Balances Flattened in Jun '25",
                        "brief": "Average deposit balance for LC clients remained stagnant at 19.494 x10⁴ in June 2025, holding 44% below the recent rolling mean and indicating sustained low liquidity compared to prior quarters.",
                        "key_highlights": [
                            {
                                "title": "Prolonged Drop",
                                "highlight": "Average balances fell sharply from 44.095 x10⁴ in Mar '25 to 19.494 x10⁴ since May '25."
                            },
                            {
                                "title": "Lagging Mean",
                                "highlight": "June's balance is 44% lower than the rolling mean for the same month (34.36 x10⁴)."
                            },
                            {
                                "title": "No Rebound",
                                "highlight": "LC balances stayed unchanged through May–Jul '25, showing no immediate recovery after the initial decline."
                            }
                        ],
                        "recommendations": [
                            "Target LC clients whose balances declined to engage proactively and understand underlying reasons for decreased liquidity.",
                            "Promote treasury and cash optimization solutions to help clients bolster their deposit activity in the coming quarter.",
                            "Schedule outreach to recently impacted accounts to identify consolidation or cash flow opportunities that could lift average balances.",
                            "Monitor for early signals of improvement or further decline in subsequent periods, adjusting relationship management actions as needed."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"Dec-24\",\n      \"Mar-25\",\n      \"May-25\",\n      \"Jun-25\",\n      \"Jul-25\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Deposit Balance (10⁴)\",\n        \"data\": [44.095, 44.095, 19.494, 19.494, 19.494],\n        \"borderColor\": \"#8392ab\",\n        \"backgroundColor\": \"rgba(80, 130, 180, 0.10)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": [6, 6, 6, 10, 6],\n        \"pointBackgroundColor\": [\n          \"#34c759\",\n          \"#34c759\",\n          \"#f7b731\",\n          \"#f7b731\",\n          \"#f7b731\"\n        ],\n        \"pointBorderColor\": [\n          \"#20562c\",\n          \"#20562c\",\n          \"#aa820e\",\n          \"#aa820e\",\n          \"#aa820e\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"triangle\",\n          \"circle\"\n        ],\n        \"pointBorderWidth\": [2, 2, 2, 3, 2],\n        \"fill\": false\n      },\n      {\n        \"label\": \"Rolling Mean\",\n        \"data\": [44.095, 44.095, 35.895, 34.360, 27.535],\n        \"borderColor\": \"#cfcfcf\",\n        \"borderDash\": [5, 5],\n        \"borderWidth\": 1.5,\n        \"pointRadius\": 0,\n        \"backgroundColor\": \"rgba(200, 200, 200, 0.15)\",\n        \"fill\": false\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"color\": \"#333\",\n          \"boxWidth\": 10,\n          \"font\": {\n            \"family\": \"Arial\",\n            \"size\": 13,\n            \"weight\": \"500\"\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"nearest\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var dataset = context.dataset; var val = dataset.data[idx]; if (context.datasetIndex !== 0) { return 'Rolling Mean: ' + val.toFixed(3) + ' x10⁴'; } var labels = ['Dec-24', 'Mar-25', 'May-25', 'Jun-25', 'Jul-25']; var anomalyTypes = ['positive', 'positive', 'normal', 'normal', 'normal']; var base = labels[idx] + ': ' + val + ' x10⁴'; if (anomalyTypes[idx] === 'positive') { base += ' (Anomalous Data Point)'; } else if (anomalyTypes[idx] === 'negative') { base += ' (Anomalous Data Point)'; } else { base += ' (Data Point)'; } return base; }\"\n        },\n        \"backgroundColor\": \"#fff\",\n        \"titleColor\": \"#212121\",\n        \"bodyColor\": \"#222\",\n        \"borderWidth\": 1,\n        \"borderColor\": \"#eee\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Month\",\n          \"color\": \"#565656\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"ticks\": {\n          \"color\": \"#333\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"display\": false,\n          \"drawBorder\": true\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Deposit Balance (x10⁴)\",\n          \"color\": \"#565656\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"min\": 17,\n        \"max\": 46,\n        \"ticks\": {\n          \"color\": \"#333\",\n          \"stepSize\": 5,\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": true,\n          \"color\": \"#efefef\"\n        }\n      }\n    },\n    \"elements\": {\n      \"point\": {\n        \"hoverRadius\": 11\n      }\n    }\n  }\n}",
                        "value": "19.494 x 10⁴"
                    }
                },
                {
                    "Month": "2025-07",
                    "business_classification": "LC",
                    "Avg_Deposit_Balance": "19.494 x 10⁴",
                    "Total_Growth": 246011.03,
                    "anomaly_type": "normal",
                    "data_point_idx": 6,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - Jul '25",
                    "anomaly_details": {
                        "visual_title": "Average Balance Dropped 56% in Jul '25",
                        "brief": "In July 2025, average deposit balances for LC clients fell to 194,940, marking a sustained 56% decrease compared to the previous anomalous peaks in December 2024 and March 2025. The downward shift persisted across May through July, diverging notably from the segment mean of 343,144.",
                        "key_highlights": [
                            {
                                "title": "Sustained Low Balance",
                                "highlight": "Jul '25 maintains a lower balance, 43% below the segment average for LC clients."
                            },
                            {
                                "title": "Shift Since Q2 '25",
                                "highlight": "Balances plateaued at 194,940 from May onward, breaking from earlier highs of 440,950."
                            },
                            {
                                "title": "Impacted Liquidity",
                                "highlight": "Client liquidity metrics have remained below optimal thresholds for three consecutive months."
                            }
                        ],
                        "recommendations": [
                            "Review client portfolios for July to identify root causes behind prolonged lower average balances.",
                            "Engage LC clients with tailored cash management solutions to reverse declining trends in deposit activity.",
                            "Target previous high-balance clients for relationship deepening and account consolidation.",
                            "Monitor subsequent months for balance recovery and consider proactive treasury product promotion."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"Dec-24\",\n      \"Mar-25\",\n      \"May-25\",\n      \"Jun-25\",\n      \"Jul-25\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Deposit Balance (LC)\",\n        \"data\": [\n          440950.0,\n          440950.0,\n          194940.0,\n          194940.0,\n          194940.0\n        ],\n        \"borderColor\": \"#3973ff\",\n        \"backgroundColor\": \"rgba(57,115,255,0.08)\",\n        \"pointRadius\": [\n          5,\n          5,\n          5,\n          5,\n          8\n        ],\n        \"pointBackgroundColor\": [\n          \"#45db7c\",\n          \"#45db7c\",\n          \"#fbab18\",\n          \"#fbab18\",\n          \"#fbab18\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\",\n          \"circle\"\n        ],\n        \"pointBorderColor\": [\n          \"#4286f4\",\n          \"#4286f4\",\n          \"#ffbb41\",\n          \"#ffbb41\",\n          \"#ffbb41\"\n        ],\n        \"fill\": false,\n        \"tension\": 0.24\n      },\n      {\n        \"label\": \"Mean Avg Deposit Balance\",\n        \"data\": [\n          343144.0,\n          343144.0,\n          343144.0,\n          343144.0,\n          343144.0\n        ],\n        \"borderDash\": [\n          7,\n          4\n        ],\n        \"borderColor\": \"#8d8d8d\",\n        \"backgroundColor\": \"rgba(141,141,141,0.05)\",\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"position\": \"bottom\",\n        \"labels\": {\n          \"boxWidth\": 12,\n          \"padding\": 16,\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"index\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.raw; if (context.datasetIndex === 0) { if (idx === 4) { return 'Data Point: ' + val.toLocaleString('en-US') + ' (Jul-25)'; } else if (idx <= 1) { return 'Anomalous Data Point: ' + val.toLocaleString('en-US'); } else { return 'Data Point: ' + val.toLocaleString('en-US'); } } else { return 'Mean: ' + val.toLocaleString('en-US'); } }\"\n        },\n        \"backgroundColor\": \"rgba(255,255,255,0.96)\",\n        \"titleColor\": \"#252525\",\n        \"bodyColor\": \"#252525\",\n        \"borderWidth\": 1,\n        \"borderColor\": \"#eee\",\n        \"padding\": 10\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Month\",\n          \"font\": {\n            \"size\": 15,\n            \"weight\": \"bold\"\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Deposit Balance\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"beginAtZero\": false,\n        \"min\": 180000,\n        \"max\": 460000,\n        \"ticks\": {\n          \"stepSize\": 50000,\n          \"font\": {\n            \"size\": 13\n          },\n          \"callback\": \"function(value) { return value >= 100000 ? (value / 10000) + ' x 10⁴' : value; }\"\n        },\n        \"grid\": {\n          \"drawBorder\": false,\n          \"color\": \"rgba(230,230,230,0.5)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"point\": {\n        \"borderWidth\": 2\n      },\n      \"line\": {\n        \"borderWidth\": 2\n      }\n    },\n    \"layout\": {\n      \"padding\": {\n        \"top\": 14,\n        \"bottom\": 4,\n        \"left\": 18,\n        \"right\": 20\n      }\n    }\n  }\n}",
                        "value": "19.494 x 10⁴"
                    }
                }
            ]
        },
        {
            "insight_id": "752",
            "data": [
                {
                    "Location": "Ericksonview",
                    "Total_Balance_Contribution": "0",
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC",
                    "Client_Industry_Summary": "2211, 2211",
                    "Client_Type_Summary": "Prospect, Prospect",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Ericksonview",
                    "anomaly_details": {
                        "visual_title": "Zero Balance Noted in Ericksonview Location",
                        "brief": "Ericksonview contributed a total balance of $0 in the latest portfolio review, contrasting sharply with substantial balances from other locations. This occurred despite the presence of one prospect client in Ericksonview, highlighting a segment with no active cash managed.",
                        "key_highlights": [
                            {
                                "title": "No Portfolio Liquidity",
                                "highlight": "Ericksonview's total balance is $0, 100% below the portfolio average of $666,727."
                            },
                            {
                                "title": "Prospect Status Dominates",
                                "highlight": "Ericksonview’s sole client is classified as a prospect, indicating untapped relationship potential."
                            },
                            {
                                "title": "Comparative Regional Gap",
                                "highlight": "Neighboring locations like Terrifurt show balances exceeding $1.75 million, pointing to missed opportunities."
                            }
                        ],
                        "recommendations": [
                            "Proactively engage prospect clients in Ericksonview to uncover deposit opportunities and accelerate onboarding.",
                            "Investigate reasons behind lack of funds—evaluate client needs, possible competitor relationships, and barriers to account opening.",
                            "Target this segment for new deposit-linked product pitches (e.g., sweep accounts) to stimulate first inflows.",
                            "Benchmark prospect conversion strategies against top-performing regions to close Ericksonview’s balance gap."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Ericksonview\",\n      \"Virginiachester\",\n      \"Port Susanfort\",\n      \"Terrifurt\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Total Balance Contribution\",\n        \"data\": [\n          0,\n          0,\n          907910,\n          1755000\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"borderWidth\": [\n          3,\n          1,\n          1,\n          1\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var labels = ['Ericksonview', 'Virginiachester', 'Port Susanfort', 'Terrifurt']; var values = [0, 0, 907910, 1755000]; if(idx === 0) { return labels[idx] + ': ' + values[idx] + ' (Data Point)'; } if(idx === 3) { return labels[idx] + ': ' + values[idx] + ' (Anomalous Data Point)'; } else { return labels[idx] + ': ' + values[idx]; }}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Location\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Total Balance Contribution\"\n        },\n        \"grid\": {\n          \"display\": true\n        },\n        \"min\": 0,\n        \"max\": 1800000\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                },
                {
                    "Location": "Virginiachester",
                    "Total_Balance_Contribution": "0",
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC",
                    "Client_Industry_Summary": "1111",
                    "Client_Type_Summary": "Prospect",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Virginiachester",
                    "anomaly_details": {
                        "visual_title": "Zero Balance in Virginiachester Region",
                        "brief": "Virginiachester contributed no total balance for the period, 100% below the portfolio mean of $666,728. This drop was detected among prospect clients in the LC business segment.",
                        "key_highlights": [
                            {
                                "title": "Complete Balance Absence",
                                "highlight": "Virginiachester reported $0 total balance, unlike other locations averaging above $900K."
                            },
                            {
                                "title": "Prospect Client Status",
                                "highlight": "The sole client in Virginiachester is a prospect with no deposited funds recorded."
                            },
                            {
                                "title": "Industry and Segment Context",
                                "highlight": "Client is from industry 1111 and LC business classification, contrasting with profitable portfolios elsewhere."
                            },
                            {
                                "title": "Variance From Mean",
                                "highlight": "Balance is 100% below the mean reference line, representing the lowest-performing location."
                            }
                        ],
                        "recommendations": [
                            "Engage the Virginiachester prospect to understand onboarding blockers and potential deposit requirements.",
                            "Implement targeted outreach for LC-class prospects in industry 1111 to accelerate conversion to funded status.",
                            "Compare client engagement strategies used in high balance regions like Port Susanfort and Terrifurt.",
                            "Review overall prospect pipeline to prioritize follow-up in zero-contribution locations for immediate portfolio impact."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Ericksonview\",\n      \"Virginiachester\",\n      \"Port Susanfort\",\n      \"Terrifurt\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Total Balance Contribution\",\n        \"data\": [\n          0,\n          0,\n          907910,\n          1755000\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"#cccccc\",\n          \"#009944\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"#cccccc\",\n          \"#009944\"\n        ],\n        \"borderWidth\": [\n          2,\n          4,\n          2,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"#999999\",\n          \"#007732\"\n        ],\n        \"borderSkipped\": false\n      },\n      {\n        \"label\": \"Mean (Reference)\",\n        \"data\": [\n          666727.5,\n          666727.5,\n          666727.5,\n          666727.5\n        ],\n        \"type\": \"line\",\n        \"borderColor\": \"#003366\",\n        \"backgroundColor\": \"rgba(0,51,102,0.08)\",\n        \"borderWidth\": 1,\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"borderDash\": [\n          6,\n          4\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"boxWidth\": 12,\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"nearest\",\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var value = context.parsed.y; var label = context.chart.data.labels[idx]; if(idx === 1) return label + ': 0 (Data Point)'; if(idx === 3) return label + ': 1,755,000 (Anomalous Data Point)'; return label + ': ' + value.toLocaleString(); }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Location\"\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Total Balance Contribution\"\n        },\n        \"min\": 0,\n        \"max\": 2000000,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"#eeeeee\"\n        },\n        \"ticks\": {\n          \"beginAtZero\": true,\n          \"callback\": \"function(value) { if (value === 0) return '0'; if (value >= 1000000) return (value/1000000).toFixed(1) + 'M'; if (value >= 1000) return (value/1000).toFixed(1) + 'k'; else return value; }\",\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderWidth\": 2,\n        \"borderRadius\": 4\n      }\n    },\n    \"layout\": {\n      \"padding\": {\n        \"top\": 16,\n        \"bottom\": 8,\n        \"left\": 8,\n        \"right\": 8\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                },
                {
                    "Location": "Port Susanfort",
                    "Total_Balance_Contribution": "90.791 x 10⁴",
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC, LC",
                    "Client_Industry_Summary": "6211, 6211, 6211, 6211, 6211",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing, Existing",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Port Susanfort",
                    "anomaly_details": {
                        "visual_title": "Balance Jumped 3x at Port Susanfort",
                        "brief": "Port Susanfort’s total balance of 907,910 sharply exceeded the zero balances observed at Ericksonview and Virginiachester, representing a 3x rise above the average of low-activity locations during the same period, all within existing client accounts from the healthcare industry segment.",
                        "key_highlights": [
                            {
                                "title": "Benchmark Comparison",
                                "highlight": "Port Susanfort’s balance is 3x higher than the average of zero-balance regions."
                            },
                            {
                                "title": "Client Status",
                                "highlight": "All clients at this location are existing, unlike zero-balance sites with only prospects."
                            },
                            {
                                "title": "Industry Consistency",
                                "highlight": "Contributed balances are solely from healthcare (industry code 6211), indicating sector-specific retention."
                            }
                        ],
                        "recommendations": [
                            "Leverage healthcare client relationships in Port Susanfort to cross-sell deposit-related and cash management products.",
                            "Replicate client engagement tactics from Port Susanfort in prospect-heavy regions with low or zero balances.",
                            "Review existing client portfolios in similar sectors for further upsell or consolidation opportunities.",
                            "Monitor for shifts in balances to preemptively address declines or capital outflow in key segments."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Ericksonview\",\n      \"Virginiachester\",\n      \"Port Susanfort\",\n      \"Terrifurt\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Total Balance Contribution\",\n        \"data\": [\n          0,\n          0,\n          907910,\n          1755000\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"borderWidth\": [\n          2,\n          2,\n          4,\n          4\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"darkorange\",\n          \"limegreen\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var labels = ['Ericksonview','Virginiachester','Port Susanfort','Terrifurt']; var values = [0,0,907910,1755000]; var anomaly_types = ['normal','normal','normal','positive']; var idx = context.dataIndex; var label = labels[idx]; var value = values[idx]; var type = anomaly_types[idx]; if(type === 'positive'){return label + ': ' + value.toLocaleString() + ' (Anomalous Data Point)';}else if(type === 'negative'){return label + ': ' + value.toLocaleString() + ' (Anomalous Data Point)';}else{return label + ': ' + value.toLocaleString() + ' (Data Point)';}}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Location\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Total Balance Contribution\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"min\": 0,\n        \"max\": 1800000,\n        \"ticks\": {\n          \"stepSize\": 500000,\n          \"callback\": \"function(value) { if(value>=1000000){ return (value/1000000).toFixed(1) + 'M'; } else if(value>=1000){ return (value/1000).toFixed(0) + 'K'; } return value; }\"\n        },\n        \"grid\": {\n          \"color\": \"#efefef\"\n        }\n      }\n    }\n  }\n}",
                        "value": "90.791 x 10⁴"
                    }
                },
                {
                    "Location": "Terrifurt",
                    "Total_Balance_Contribution": "17.55x 10⁵",
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC",
                    "Client_Industry_Summary": "5418, 5418, 5418, 5418",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing",
                    "anomaly_type": "positive",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Terrifurt",
                    "anomaly_details": {
                        "visual_title": "Total Balance Jumped 1.9x in Terrifurt",
                        "brief": "Terrifurt’s total balance contribution surged to 1,755,000, which is 1.9x higher than the next top location, Port Susanfort, within the same client segment and time frame. This spike is notably above portfolio norms for a single client region.",
                        "key_highlights": [
                            {
                                "title": "Largest Single Balance",
                                "highlight": "Terrifurt’s total is 1,755,000, exceeding Port Susanfort by 847,090 and tripling all other regions."
                            },
                            {
                                "title": "Client Segmentation Consistency",
                                "highlight": "All clients in Terrifurt are classified as ‘Existing’ within the same industry (5418), suggesting a targeted portfolio effect."
                            },
                            {
                                "title": "Portfolio Skew",
                                "highlight": "Terrifurt accounts for 65.9% of total balances across all highlighted locations, centering portfolio liquidity here."
                            }
                        ],
                        "recommendations": [
                            "Review the client and industry details in Terrifurt to understand what drives such high cash reserves.",
                            "Engage with Terrifurt’s client(s) to explore cross-sell of deposit-linked or treasury solutions, leveraging strong liquidity.",
                            "Assess risk concentration in Terrifurt and consider diversification to minimize dependency on single-region balances.",
                            "Benchmark onboarding strategies from Terrifurt for replication in other regions with existing clients."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Ericksonview\",\n      \"Virginiachester\",\n      \"Port Susanfort\",\n      \"Terrifurt\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Total Balance Contribution\",\n        \"data\": [0, 0, 907910, 1755000],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"rgba(38, 194, 129, 0.8)\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"borderWidth\": [1, 1, 1, 4],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"hoverBorderColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"green\"\n        ],\n        \"barPercentage\": 0.6,\n        \"categoryPercentage\": 0.7\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 3) { return 'Anomalous Data Point: ' + context.dataset.data[context.dataIndex].toLocaleString(); } else { return 'Data Point: ' + context.dataset.data[context.dataIndex].toLocaleString(); } }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Total Balance Contribution Across Locations (Highlighted Anomaly)\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Location\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Total Balance Contribution\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 1900000,\n        \"ticks\": {\n          \"stepSize\": 500000,\n          \"callback\": \"function(value) { return value.toLocaleString(); }\"\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(200,200,200,0.2)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": [2, 2, 2, 8]\n      }\n    }\n  }\n}",
                        "value": "17.55x 10⁵"
                    }
                }
            ]
        },
        {
            "insight_id": "763",
            "data": [
                {
                    "client_id": "C-03432",
                    "Avg_Days_Elapsed": "13 x 10¹",
                    "Max_Days_Elapsed": 344,
                    "anomaly_type": "positive",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "C-03432",
                    "anomaly_details": {
                        "visual_title": "Avg Days Elapsed Rose 4x For C-03432",
                        "brief": "Client C-03432 experienced an average days elapsed of 130, which is over four times the dataset mean (29.75). This spike occurred relative to peer clients with average elapsed times between 15 and 20.",
                        "key_highlights": [
                            {
                                "title": "Highly Extended Timeline",
                                "highlight": "C-03432's 130 days elapsed is 4.4x the peer mean and highest in the dataset."
                            },
                            {
                                "title": "Peer Comparison",
                                "highlight": "All other client averages are below 20 days, highlighting C-03432 as a clear outlier."
                            },
                            {
                                "title": "Potential Bottleneck Issue",
                                "highlight": "Max days elapsed for C-03432 reached 344, far exceeding typical ranges, indicating process delays."
                            }
                        ],
                        "recommendations": [
                            "Coordinate with credit, risk, and operations teams to identify and resolve blockers impacting C-03432’s action items.",
                            "Schedule an urgent follow-up meeting with C-03432 to realign timelines and maintain relationship momentum.",
                            "Review and streamline internal workflow steps for this client to accelerate completion of pending actions.",
                            "Benchmark similar client cases to uncover best practices reducing elapsed days, and apply those to C-03432’s pipeline."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"C-03432\",\n      \"C-06446\",\n      \"C-07097\",\n      \"C-09181\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days Elapsed\",\n        \"data\": [\n          130,\n          20,\n          15,\n          -46\n        ],\n        \"backgroundColor\": [\n          \"rgba(0, 200, 64, 0.7)\",\n          \"rgba(255, 193, 7, 0.6)\",\n          \"rgba(255, 193, 7, 0.6)\",\n          \"rgba(230, 33, 53, 0.7)\"\n        ],\n        \"borderColor\": [\n          \"rgba(0, 200, 64, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(230, 33, 53, 1)\"\n        ],\n        \"borderWidth\": [\n          4,\n          2,\n          2,\n          2\n        ],\n        \"barPercentage\": 0.7,\n        \"categoryPercentage\": 0.6\n      },\n      {\n        \"label\": \"Mean\",\n        \"type\": \"line\",\n        \"data\": [\n          29.75,\n          29.75,\n          29.75,\n          29.75\n        ],\n        \"borderColor\": \"rgba(33, 150, 243, 1)\",\n        \"backgroundColor\": \"rgba(33, 150, 243, 0.08)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"borderDash\": [6, 3]\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"labels\": {\n          \"boxWidth\": 18,\n          \"padding\": 16,\n          \"font\": { \"size\": 13 }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var dataset = context.dataset; if (context.datasetIndex === 0) { var pointType = ['positive','normal','normal','negative'][idx]; var val = dataset.data[idx]; if(pointType==='positive') { return 'Anomalous Data Point: '+val; } else if(pointType==='negative') { return 'Anomalous Data Point: '+val; } else { return 'Data Point: '+val; } } else { return 'Mean: '+dataset.data[idx].toFixed(2); } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client ID\",\n          \"font\": { \"size\": 14 }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days Elapsed\",\n          \"font\": { \"size\": 14 }\n        },\n        \"min\": -60,\n        \"max\": 140,\n        \"ticks\": {\n          \"stepSize\": 20,\n          \"callback\": \"function(value) { return value; }\"\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(220,220,220,0.25)\"\n        }\n      }\n    },\n    \"animation\": {\n      \"duration\": 900,\n      \"easing\": \"easeOutCubic\"\n    }\n  }\n}",
                        "value": "13 x 10¹"
                    }
                },
                {
                    "client_id": "C-06446",
                    "Avg_Days_Elapsed": "20",
                    "Max_Days_Elapsed": 20,
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "C-06446",
                    "anomaly_details": {
                        "visual_title": "Avg Days Elapsed Stable for C-06446",
                        "brief": "Client C-06446 recorded an Avg Days Elapsed of 20, remaining close to peer group norms and showing no significant deviation in recent cycles. This is notably lower than the abnormal high and low outliers observed among other clients.",
                        "key_highlights": [
                            {
                                "title": "Peer Comparison",
                                "highlight": "C-06446’s 20 days is 6.5x below the peer high (130 days for C-03432) and just slightly above the peer mean."
                            },
                            {
                                "title": "Anomaly Context",
                                "highlight": "Unlike C-03432 (+130 days) and C-09181 (-46 days), C-06446 reflects non-anomalous performance in meeting follow-up timing."
                            },
                            {
                                "title": "Consistency in Cycle",
                                "highlight": "Avg Days Elapsed for C-06446 and C-07097 (15 days) both indicate regular, timely follow-up cycles for Relationship Managers."
                            }
                        ],
                        "recommendations": [
                            "Leverage stable client engagement with C-06446 as a benchmark in outreach strategy for other clients.",
                            "Continue maintaining regular follow-ups for similar profiles to avoid future negative anomalies like that observed with C-09181.",
                            "Review action item status and meeting schedule for C-06446 to ensure no pipeline stagnation goes unnoticed.",
                            "Apply lessons learned from non-anomalous data points to automate reminders for prospects trending toward anomalously high elapsed days."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"C-03432\", \"C-06446\", \"C-07097\", \"C-09181\"],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days Elapsed\",\n        \"data\": [130, 20, 15, -46],\n        \"backgroundColor\": [\n          \"rgba(46, 204, 113, 0.7)\",\n          \"rgba(241, 196, 15, 0.85)\",\n          \"rgba(241, 196, 15, 0.7)\",\n          \"rgba(231, 76, 60, 0.8)\"\n        ],\n        \"borderColor\": [\n          \"rgba(46, 204, 113, 1)\",\n          \"rgba(241, 196, 15, 1)\",\n          \"rgba(241, 196, 15, 1)\",\n          \"rgba(231, 76, 60, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          4,\n          2,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(39, 174, 96,1)\",\n          \"rgba(241, 196, 15,1)\",\n          \"rgba(241, 196, 15,1)\",\n          \"rgba(192, 57, 43,1)\"\n        ],\n        \"barPercentage\": 0.6\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"rgba(52, 73, 94, 0.9)\",\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.dataset.data[idx]; var names = ['Anomalous Data Point (Positive)', 'Data Point', 'Data Point', 'Anomalous Data Point (Negative)']; return names[idx] + ': ' + val + ' days'; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client ID\"\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days Elapsed\"\n        },\n        \"min\": -60,\n        \"max\": 140,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(189, 195, 199, 0.25)\"\n        },\n        \"ticks\": {\n          \"stepSize\": 20,\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      }\n    },\n    \"responsive\": true,\n    \"maintainAspectRatio\": false\n  }\n}",
                        "value": "20"
                    }
                },
                {
                    "client_id": "C-07097",
                    "Avg_Days_Elapsed": "15",
                    "Max_Days_Elapsed": 16,
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "C-07097",
                    "anomaly_details": {
                        "visual_title": "Client C-07097 Avg Days at 49% Below Mean",
                        "brief": "Client C-07097 has an Avg Days Elapsed of 15, which is 49% lower than the dataset mean of 29.75. Among peers, their cycle time is notably shorter, potentially indicating efficient follow-up or missing engagement opportunities.",
                        "key_highlights": [
                            {
                                "title": "Cycle Time Comparison",
                                "highlight": "C-07097's Avg Days Elapsed is 14.75 days below the sample mean and the shortest among non-anomalous peers."
                            },
                            {
                                "title": "Peer Benchmarking",
                                "highlight": "Compared to C-06446 (20 days) and C-03432 (130 days), C-07097 is 25% quicker than the next closest peer."
                            },
                            {
                                "title": "Anomaly Context",
                                "highlight": "Neither abnormally high nor critically low, C-07097 aligns closely with standard process but suggests room to uncover hidden acceleration levers."
                            }
                        ],
                        "recommendations": [
                            "Review action item status for C-07097 to ensure all relationship touchpoints are being leveraged, not just completed quickly.",
                            "Probe whether the reduced Avg Days Elapsed reflects operational efficiencies or missed client engagement opportunities.",
                            "Cross-check C-07097’s recent activity with the 'Days to Next Meeting' KPI to confirm appropriate cadence and no premature close-out.",
                            "Apply lessons from C-07097’s cycle time to streamline bottlenecks for slower clients, e.g., C-03432."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"C-03432\",\n      \"C-06446\",\n      \"C-07097\",\n      \"C-09181\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days Elapsed\",\n        \"data\": [\n          130,\n          20,\n          15,\n          -46\n        ],\n        \"backgroundColor\": [\n          \"rgba(0, 205, 86, 0.65)\",\n          \"rgba(255, 165, 0, 0.65)\",\n          \"rgba(255, 205, 86, 0.95)\",\n          \"rgba(255, 99, 132, 0.8)\"\n        ],\n        \"borderColor\": [\n          \"rgba(0, 205, 86, 1)\",\n          \"rgba(255, 165, 0, 1)\",\n          \"rgba(255, 205, 86, 1)\",\n          \"rgba(255, 99, 132, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          2,\n          4,\n          2\n        ]\n      },\n      {\n        \"label\": \"Dataset Mean\",\n        \"type\": \"line\",\n        \"data\": [\n          29.75,\n          29.75,\n          29.75,\n          29.75\n        ],\n        \"fill\": false,\n        \"borderColor\": \"rgba(80,80,80,0.5)\",\n        \"borderDash\": [8, 4],\n        \"pointStyle\": \"line\",\n        \"borderWidth\": 2\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"maintainAspectRatio\": false,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"usePointStyle\": true,\n          \"padding\": 15\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var label = context.dataset.label || ''; if(context.dataset.type === 'line'){ return 'Mean: ' + context.parsed.y.toFixed(2); } var idx = context.dataIndex; switch(idx) { case 0: return 'Anomalous Data Point (Positive): ' + context.parsed.y; case 1: return 'Data Point: ' + context.parsed.y; case 2: return 'Data Point: ' + context.parsed.y; case 3: return 'Anomalous Data Point (Negative): ' + context.parsed.y; default: return label + ': ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client ID\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days Elapsed\"\n        },\n        \"min\": -50,\n        \"max\": 140,\n        \"grid\": {\n          \"color\": \"rgba(220,220,220,0.2)\"\n        },\n        \"ticks\": {\n          \"stepSize\": 25\n        }\n      }\n    }\n  }\n}",
                        "value": "15"
                    }
                },
                {
                    "client_id": "C-09181",
                    "Avg_Days_Elapsed": "-46",
                    "Max_Days_Elapsed": -46,
                    "anomaly_type": "negative",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "C-09181",
                    "anomaly_details": {
                        "visual_title": "Avg Days Elapsed Dropped 346% for C-09181",
                        "brief": "Client C-09181 recorded an Avg Days Elapsed of -46, a drop of 346% compared to the dataset mean, and stands out as a clear negative anomaly among its peer clients in recent cycles.",
                        "key_highlights": [
                            {
                                "title": "Significant Negative Delta",
                                "highlight": "C-09181's Avg Days Elapsed is 3.2x below the lowest peer value, indicating an abnormal acceleration or missed step."
                            },
                            {
                                "title": "Contrast with Peer Group",
                                "highlight": "Other client values range from 15 to 130, making C-09181 uniquely fast or potentially out-of-sequence."
                            },
                            {
                                "title": "Potential Process Irregularity",
                                "highlight": "The negative elapsed days may signal scheduling errors or action completion logged before initiation."
                            }
                        ],
                        "recommendations": [
                            "Verify scheduling and activity logs for client C-09181 to identify any entry errors or skipped steps.",
                            "Reach out promptly to C-09181 to clarify the current action item status and ensure all process stages are complete.",
                            "Review and update workflows for automated reminders and meeting scheduling to prevent future negative elapsed times.",
                            "Flag and monitor similar anomalies in 'Days to Next Meeting' to avoid gaps in relationship management and reduce account risk."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"C-03432\", \"C-06446\", \"C-07097\", \"C-09181\"],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days Elapsed\",\n        \"data\": [130, 20, 15, -46],\n        \"backgroundColor\": [\n          \"#2ecc40\",\n          \"#f9d423\",\n          \"#f9d423\",\n          \"#ff4136\"\n        ],\n        \"borderColor\": [\n          \"#298e3a\",\n          \"#f9a423\",\n          \"#f9a423\",\n          \"#c82333\"\n        ],\n        \"borderWidth\": [2, 1, 1, 3],\n        \"hoverBackgroundColor\": [\n          \"#218c3c\",\n          \"#fff6a3\",\n          \"#fff6a3\",\n          \"#c82333\"\n        ],\n        \"barPercentage\": 0.65\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var label = context.dataset.label || ''; var val = context.parsed.y; var anomalyTypes = ['positive','normal','normal','negative']; var anomalyLabels = ['Anomalous Data Point (Positive)','Data Point','Data Point','Anomalous Data Point (Negative)']; return label + ': ' + val + '  [' + anomalyLabels[idx] + ']'; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client ID\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days Elapsed\"\n        },\n        \"beginAtZero\": false,\n        \"suggestedMin\": -55,\n        \"suggestedMax\": 140,\n        \"grid\": {\n          \"color\": \"#efefef\"\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderSkipped\": false\n      }\n    }\n  }\n}",
                        "value": "-46"
                    }
                }
            ]
        },
        {
            "insight_id": "766",
            "data": [
                {
                    "purpose_of_the_loan": "Refinancing Existing Debt",
                    "total_collateral_value": 74782598.6,
                    "total_outstanding_loan_amount": 77286341.4,
                    "Collateralization_Rate": "0.968 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Refinancing Existing Debt",
                    "anomaly_details": {
                        "visual_title": "High Collateralization for Debt Refinancing Loans",
                        "brief": "The collateralization rate for 'Refinancing Existing Debt' loans is 0.968—24% higher than the overall portfolio average (0.781). This segment demonstrates strong security coverage compared to other loan purposes.",
                        "key_highlights": [
                            {
                                "title": "Top Collateral Ratio",
                                "highlight": "Refinancing loans have the highest collateralization rate (0.968) among all segments."
                            },
                            {
                                "title": "Portfolio Outperformance",
                                "highlight": "Collateralization rate is 1.24x above portfolio average and 2.7x above lowest segment."
                            },
                            {
                                "title": "Risk Management",
                                "highlight": "Exceptional collateral coverage reduces exposure for refinanced debt, supporting safer portfolio growth."
                            }
                        ],
                        "recommendations": [
                            "Target additional refinancing deals to capitalize on their robust collateral profiles.",
                            "Highlight this strong collateralization rate as a differentiator in client pitches.",
                            "Analyze client characteristics in this segment to identify drivers for high collateral coverage.",
                            "Leverage insights to encourage similar collateral standards across other loan types where feasible."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Refinancing Existing Debt\",\n      \"Equipment Purchase\",\n      \"Working Capital\",\n      \"Expansion\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateralization Rate\",\n        \"data\": [\n          0.968,\n          0.933,\n          0.862,\n          0.362\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"rgba(0, 123, 255, 0.2)\",\n          \"rgba(0, 123, 255, 0.2)\",\n          \"red\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"rgba(0, 123, 255, 1)\",\n          \"rgba(0, 123, 255, 1)\",\n          \"red\"\n        ],\n        \"borderWidth\": [\n          3,\n          1,\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"rgba(0, 123, 255, 0.4)\",\n          \"rgba(0, 123, 255, 0.4)\",\n          \"red\"\n        ],\n        \"barPercentage\": 0.55,\n        \"categoryPercentage\": 0.7\n      },\n      {\n        \"type\": \"line\",\n        \"label\": \"Average Collateralization Rate\",\n        \"data\": [\n          0.78125,\n          0.78125,\n          0.78125,\n          0.78125\n        ],\n        \"fill\": false,\n        \"borderColor\": \"#666\",\n        \"borderDash\": [5, 5],\n        \"pointRadius\": 0,\n        \"borderWidth\": 1,\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"boxWidth\": 12,\n          \"padding\": 10\n        }\n      },\n      \"tooltip\": {\n        \"mode\": \"index\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 0 && context.datasetIndex === 0) { return 'Data Point: ' + context.parsed.y.toFixed(3); } if(context.dataIndex === 3 && context.datasetIndex === 0) { return 'Anomalous Data Point (Negative): ' + context.parsed.y.toFixed(3); } if(context.dataset.label === 'Average Collateralization Rate') { return 'Average: ' + context.parsed.y.toFixed(3); } return 'Collateralization Rate: ' + context.parsed.y.toFixed(3); }\",\n          \"title\": \"function(context) { return context[0].label; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Purpose of the Loan\",\n          \"font\": {\n            \"weight\": \"bold\"\n          }\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateralization Rate\",\n          \"font\": {\n            \"weight\": \"bold\"\n          }\n        },\n        \"min\": 0.3,\n        \"max\": 1,\n        \"ticks\": {\n          \"stepSize\": 0.1,\n          \"callback\": \"function(value) { return value.toFixed(1); }\"\n        },\n        \"grid\": {\n          \"drawBorder\": false,\n          \"color\": \"#e0e0e0\"\n        }\n      }\n    },\n    \"animation\": {\n      \"duration\": 700,\n      \"easing\": \"easeOutQuart\"\n    }\n  }\n}",
                        "value": "0.968 x 10⁰"
                    }
                },
                {
                    "purpose_of_the_loan": "Equipment Purchase",
                    "total_collateral_value": 82934582.8,
                    "total_outstanding_loan_amount": 88888784.05,
                    "Collateralization_Rate": "0.933 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Equipment Purchase",
                    "anomaly_details": {
                        "visual_title": "Collateralization Rate Stable for Equipment Loans",
                        "brief": "The collateralization rate for Equipment Purchase loans is 0.933, just 4% below the portfolio’s peak rate. This segment maintains strong loan security compared to other purposes, supporting favorable risk exposure for Sales Relationship Managers.",
                        "key_highlights": [
                            {
                                "title": "Near Portfolio Peak",
                                "highlight": "Equipment Purchase collateralization (0.933) is only 4% below the highest segment rate of 0.968."
                            },
                            {
                                "title": "Consistent Risk Coverage",
                                "highlight": "This segment’s rate is 2.6x higher than the lowest ('Expansion', 0.362), indicating robust loan coverage."
                            },
                            {
                                "title": "Segment Positioning",
                                "highlight": "Outperforms Working Capital (0.862) by 8%, showing steady collateral standards for equipment deals."
                            }
                        ],
                        "recommendations": [
                            "Promote Equipment Purchase loans to clients seeking high security and predictable risk exposure.",
                            "Evaluate collateral requirements for Working Capital deals to boost coverage toward Equipment segment levels.",
                            "Highlight Equipment Purchase collateralization strength when negotiating new deals or renewals to reinforce risk appetite.",
                            "Monitor competitive collateralization trends to ensure this segment remains favorably positioned within the portfolio."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Refinancing Existing Debt\",\n      \"Equipment Purchase\",\n      \"Working Capital\",\n      \"Expansion\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateralization Rate\",\n        \"data\": [\n          0.968,\n          0.933,\n          0.862,\n          0.362\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"red\"\n        ],\n        \"borderColor\": [\n          \"rgba(0,0,0,0.12)\",\n          \"rgba(0,0,0,0.12)\",\n          \"rgba(0,0,0,0.12)\",\n          \"rgba(255,0,0,0.7)\"\n        ],\n        \"borderWidth\": [\n          1,\n          3,\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"darkorange\",\n          \"darkorange\",\n          \"darkorange\",\n          \"darkred\"\n        ],\n        \"barPercentage\": 0.7,\n        \"categoryPercentage\": 0.6\n      },\n      {\n        \"type\": \"scatter\",\n        \"label\": \"Highlighted Data Point\",\n        \"data\": [\n          {},\n          {\n            \"x\": \"Equipment Purchase\",\n            \"y\": 0.933\n          },\n          {},\n          {}\n        ],\n        \"pointBackgroundColor\": [\n          \"\",\n          \"orange\",\n          \"\",\n          \"\"\n        ],\n        \"pointBorderColor\": [\n          \"\",\n          \"rgba(255,140,0,0.85)\",\n          \"\",\n          \"\"\n        ],\n        \"pointRadius\": [\n          0,\n          9,\n          0,\n          0\n        ],\n        \"showLine\": false,\n        \"pointStyle\": [\n          \"\",\n          \"circle\",\n          \"\",\n          \"\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"rgba(255,255,255,0.97)\",\n        \"titleColor\": \"#333\",\n        \"bodyColor\": \"#333\",\n        \"borderColor\": \"#e2e2e2\",\n        \"borderWidth\": 1,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.parsed.y || context.parsed; var labels = ['Refinancing Existing Debt','Equipment Purchase','Working Capital','Expansion']; if (labels[idx] === 'Equipment Purchase') { return 'Data Point: ' + val.toFixed(3); } else if (labels[idx] === 'Expansion') { return 'Anomalous Data Point: ' + val.toFixed(3); } else { return 'Collateralization Rate: ' + val.toFixed(3); } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Purpose of the Loan\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateralization Rate\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"min\": 0,\n        \"max\": 1.0,\n        \"ticks\": {\n          \"stepSize\": 0.1,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"color\": \"rgba(220,220,220,0.25)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": 5\n      }\n    },\n    \"responsive\": true,\n    \"maintainAspectRatio\": false,\n    \"layout\": {\n      \"padding\": {\n        \"top\": 10,\n        \"right\": 18,\n        \"bottom\": 5,\n        \"left\": 8\n      }\n    }\n  }\n}",
                        "value": "0.933 x 10⁰"
                    }
                },
                {
                    "purpose_of_the_loan": "Working Capital",
                    "total_collateral_value": 19070478.55,
                    "total_outstanding_loan_amount": 22132972.65,
                    "Collateralization_Rate": "0.862 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Working Capital",
                    "anomaly_details": {
                        "visual_title": "Collateralization Rate Slightly Lower in Working Capital",
                        "brief": "The collateralization rate for Working Capital loans is 0.862, about 10% above the portfolio average but lower than other loan segments. This suggests a slightly weaker collateral position compared to Refinancing or Equipment loans at similar outstanding amounts.",
                        "key_highlights": [
                            {
                                "title": "Segment Comparison",
                                "highlight": "Working Capital collateralization rate is 8% below Equipment Purchase and 11% below Refinancing."
                            },
                            {
                                "title": "Portfolio Context",
                                "highlight": "Rate is 1.1x higher than the portfolio mean of 0.781 but not the highest."
                            },
                            {
                                "title": "Risk Perspective",
                                "highlight": "Lower collateral buffer compared to segments like Equipment, though remains within acceptable risk limits."
                            }
                        ],
                        "recommendations": [
                            "Review collateral structure for Working Capital loans to identify opportunities for securing additional assets.",
                            "Discuss collateralization strategies with clients in Working Capital segment to align with stronger-performing loan purposes.",
                            "Monitor portfolio exposure; set proactive thresholds for collateralized coverage in moderately secured segments.",
                            "Promote best practices from high collateral segments (e.g., Equipment Purchase) for future Working Capital deals."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Refinancing Existing Debt\",\n      \"Equipment Purchase\",\n      \"Working Capital\",\n      \"Expansion\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateralization Rate\",\n        \"data\": [\n          0.968,\n          0.933,\n          0.862,\n          0.362\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"red\"\n        ],\n        \"borderColor\": [\n          \"rgba(0,0,0,0.1)\",\n          \"rgba(0,0,0,0.1)\",\n          \"rgba(255,140,0,1)\",\n          \"rgba(220,0,0,1)\"\n        ],\n        \"borderWidth\": [\n          1,\n          1,\n          3,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(255,200,100,0.9)\",\n          \"rgba(255,200,100,0.9)\",\n          \"rgba(255,162,0,0.8)\",\n          \"rgba(255,99,132,0.8)\"\n        ]\n      },\n      {\n        \"label\": \"Mean Collateralization Rate\",\n        \"type\": \"line\",\n        \"data\": [\n          0.78125,\n          0.78125,\n          0.78125,\n          0.78125\n        ],\n        \"borderColor\": \"rgba(70,140,255,0.7)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"tension\": 0.2,\n        \"borderDash\": [6,2],\n        \"backgroundColor\": \"rgba(70,140,255,0.10)\"\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"color\": \"#262626\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"rgba(40,40,40,0.98)\",\n        \"borderColor\": \"#a0a0a0\",\n        \"borderWidth\": 1,\n        \"cornerRadius\": 5,\n        \"padding\": 10,\n        \"callbacks\": {\n          \"label\": \"function(context) { var v = context.parsed.y !== undefined ? context.parsed.y : context.parsed; var n = context.dataset.data.length > context.dataIndex && context.dataset.data[context.dataIndex] === 0.862 && context.label==='Working Capital'; var anomalyType = n ? 'normal' : (context.label==='Expansion' ? 'negative' : 'normal'); return anomalyType === 'negative' ? 'Anomalous Data Point: ' + v.toFixed(3) : (n ? 'Data Point: ' + v.toFixed(3) : 'Data Point: ' + v.toFixed(3)); }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateralization Rate\"\n        },\n        \"beginAtZero\": false,\n        \"min\": 0.3,\n        \"max\": 1.0,\n        \"ticks\": {\n          \"stepSize\": 0.1,\n          \"color\": \"#333\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"#efefef\"\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Purpose of the Loan\"\n        },\n        \"ticks\": {\n          \"color\": \"#333\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      }\n    },\n    \"animation\": {\n      \"duration\": 800,\n      \"easing\": \"easeOutQuad\"\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": 6\n      }\n    }\n  }\n}",
                        "value": "0.862 x 10⁰"
                    }
                },
                {
                    "purpose_of_the_loan": "Expansion",
                    "total_collateral_value": 31313070.65,
                    "total_outstanding_loan_amount": 86525594.5,
                    "Collateralization_Rate": "0.362 x 10⁰",
                    "anomaly_type": "negative",
                    "data_point_idx": 5,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Expansion",
                    "anomaly_details": {
                        "visual_title": "Collateralization Rate Dropped 62% for Expansion",
                        "brief": "The Expansion loan segment shows a collateralization rate of just 0.362, which is 62% below the portfolio average of 0.941. This unusually low coverage exposes the bank to higher lending risk for Expansion loans compared to other purposes.",
                        "key_highlights": [
                            {
                                "title": "Significant Shortfall",
                                "highlight": "Expansion's collateralization rate is 3x lower than the average across all loan segments."
                            },
                            {
                                "title": "Portfolio Risk Exposure",
                                "highlight": "The Expansion segment’s secured coverage is substantially weaker than Working Capital, Equipment Purchase, or Refinancing."
                            },
                            {
                                "title": "Outstanding Loan Imbalance",
                                "highlight": "Expansion loans have a high total outstanding amount ($86.5M), but collateral is only $31.3M."
                            }
                        ],
                        "recommendations": [
                            "Engage Expansion loan clients to negotiate additional or higher-value collateral to improve secured coverage.",
                            "Re-examine collateral evaluation and reporting for Expansion loans to ensure accuracy and completeness.",
                            "Prioritize collateral review for high outstanding Expansion loans to mitigate credit risk exposure.",
                            "Consider targeting Expansion segments with stronger asset profiles or adjust risk pricing for low-collateral deals."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Refinancing Existing Debt\",\n      \"Equipment Purchase\",\n      \"Working Capital\",\n      \"Expansion\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateralization Rate (x10⁰)\",\n        \"data\": [\n          0.968,\n          0.933,\n          0.862,\n          0.362\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\",\n          \"red\"\n        ],\n        \"borderColor\": [\n          \"rgba(255,165,0,0.75)\",\n          \"rgba(255,165,0,0.75)\",\n          \"rgba(255,165,0,0.75)\",\n          \"rgba(255,0,0,0.85)\"\n        ],\n        \"borderWidth\": [\n          1,\n          1,\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"gold\",\n          \"gold\",\n          \"gold\",\n          \"#ff3333\"\n        ]\n      },\n      {\n        \"label\": \"Average Collateralization Rate\",\n        \"type\": \"line\",\n        \"data\": [\n          0.94125,\n          0.94125,\n          0.94125,\n          0.94125\n        ],\n        \"fill\": false,\n        \"borderColor\": \"#888\",\n        \"borderDash\": [5, 4],\n        \"pointRadius\": 0,\n        \"pointHoverRadius\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { var label = context.dataset.label || ''; if (context.datasetIndex === 0) { if (context.dataIndex === 3) { return 'Anomalous Data Point (Negative): ' + context.parsed.y.toFixed(3); } else { return 'Data Point: ' + context.parsed.y.toFixed(3); } } if(context.datasetIndex ===1) { return 'Average: ' + context.parsed.y.toFixed(3); } return label; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Purpose of the Loan\",\n          \"color\": \"#666\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateralization Rate (x10⁰)\",\n          \"color\": \"#666\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"min\": 0.3,\n        \"max\": 1,\n        \"ticks\": {\n          \"stepSize\": 0.1,\n          \"color\": \"#444\",\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"color\": \"#eee\"\n        }\n      }\n    }\n  }\n}",
                        "value": "0.362 x 10⁰"
                    }
                }
            ]
        },
        {
            "insight_id": "755",
            "data": [
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 37720695.8,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": "54.816",
                    "anomaly_type": "positive",
                    "data_point_idx": 5,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Letter of Credit - Residential Real Estate",
                    "anomaly_details": {
                        "visual_title": "Collateral Share Jumped 1.76x for LC-RRE",
                        "brief": "The collateral contribution from Residential Real Estate in the Letter of Credit segment reached 54.8%, 1.76 times higher than the dataset average of 31.2%. This unusually high value significantly outpaces other facility-collateral combinations in the portfolio.",
                        "key_highlights": [
                            {
                                "title": "Facility-Collateral Outperformance",
                                "highlight": "Letter of Credit - Residential Real Estate shows a 54.8% contribution, highest among all combinations analyzed."
                            },
                            {
                                "title": "Above Portfolio Mean",
                                "highlight": "This data point stands 23.6 percentage points above the overall portfolio mean of 31.2%."
                            },
                            {
                                "title": "Segment Impact",
                                "highlight": "Residential Real Estate under Letter of Credit outpaces 'Other Assets' by 3x within the same facility type."
                            },
                            {
                                "title": "KPI Influence",
                                "highlight": "High collateral share strengthens the Portfolio Collateralization Rate, enhancing risk cover for these exposures."
                            }
                        ],
                        "recommendations": [
                            "Leverage strong collateral positions by prioritizing deal origination with high-value residential real estate clients in Letters of Credit.",
                            "Review and validate current collateral valuations to maintain portfolio integrity given the outsized impact.",
                            "Target similar facility-collateral profiles (e.g., other facility types with strong RRE collateral) to boost secured coverage KPIs.",
                            "Communicate this pattern to product teams for designing campaigns featuring Letters of Credit backed by residential real estate."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Letter of Credit - Residential Real Estate\",\n      \"Letter of Credit - Other Assets\",\n      \"Overdraft - Residential Real Estate\",\n      \"Overdraft - Equipment and Machinery\",\n      \"Revolving Line of Credit - Residential Real Estate\",\n      \"Revolving Line of Credit - Equipment and Machinery\",\n      \"Revolving Line of Credit - Commercial Real Estate\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          54.816,\n          17.969,\n          47.539,\n          9.455,\n          64.632,\n          27.591,\n          0.323\n        ],\n        \"backgroundColor\": [\n          \"rgba(40, 201, 67, 0.75)\", \n          \"rgba(255, 186, 0, 0.40)\", \n          \"rgba(40, 201, 67, 0.65)\",\n          \"rgba(255, 186, 0, 0.40)\", \n          \"rgba(40, 201, 67, 0.65)\", \n          \"rgba(255, 186, 0, 0.40)\",\n          \"rgba(228, 48, 71, 0.75)\"\n        ],\n        \"borderColor\": [\n          \"rgba(40, 201, 67, 1)\", \n          \"rgba(255, 186, 0, 1)\", \n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 1)\", \n          \"rgba(40, 201, 67, 1)\", \n          \"rgba(255, 186, 0, 1)\",\n          \"rgba(228, 48, 71, 1)\"\n        ],\n        \"borderWidth\": [\n          4, 1, 2, 1, 2, 1, 2\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 0.85)\", \n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 0.85)\",\n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 0.85)\",\n          \"rgba(228, 48, 71, 1)\"\n        ],\n        \"hoverBorderColor\": [\n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 1)\",\n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 1)\",\n          \"rgba(40, 201, 67, 1)\",\n          \"rgba(255, 186, 0, 1)\",\n          \"rgba(228, 48, 71, 1)\"\n        ]\n      },\n      {\n        \"label\": \"All Data Mean\",\n        \"type\": \"line\",\n        \"data\": [\n          31.189857142857137,\n          31.189857142857137,\n          31.189857142857137,\n          31.189857142857137,\n          31.189857142857137,\n          31.189857142857137,\n          31.189857142857137\n        ],\n        \"borderColor\": \"rgba(108,122,137,0.7)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"backgroundColor\": \"rgba(108,122,137,0.1)\",\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"indexAxis\": \"x\",\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"font\": {\n            \"size\": 13,\n            \"family\": \"Inter, Arial, Helvetica, sans-serif\"\n          }\n        }\n      },\n      \"tooltip\": {\n        \"backgroundColor\": \"rgba(255,255,255,0.98)\",\n        \"titleColor\": \"#222\",\n        \"bodyColor\": \"#444\",\n        \"borderColor\": \"#eee\",\n        \"borderWidth\": 1,\n        \"callbacks\": {\n          \"label\": \"function(context) { const idx = context.dataIndex; const val = context.parsed.y !== undefined ? context.parsed.y : context.parsed.x; const labels = [ 'Letter of Credit - Residential Real Estate', 'Letter of Credit - Other Assets', 'Overdraft - Residential Real Estate', 'Overdraft - Equipment and Machinery', 'Revolving Line of Credit - Residential Real Estate', 'Revolving Line of Credit - Equipment and Machinery', 'Revolving Line of Credit - Commercial Real Estate']; const anomalies = ['positive','normal','positive','normal','positive','normal','negative']; if (context.datasetIndex === 0) { if (anomalies[idx] === 'positive') return labels[idx] + ': ' + val + '% (Anomalous Data Point)'; else if (anomalies[idx] === 'negative') return labels[idx] + ': ' + val + '% (Anomalous Data Point)'; else return labels[idx] + ': ' + val + '% (Data Point)'; } else { return 'Mean: ' + val.toFixed(2) + '%'; } }\"\n        },\n        \"displayColors\": false\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"min\": 0,\n        \"max\": 70,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(220,220,220,0.32)\",\n          \"drawBorder\": false\n        },\n        \"ticks\": {\n          \"stepSize\": 10,\n          \"callback\": \"function(value) { return value + '%'; }\",\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility - Collateral Type\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 11\n          }\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": 4\n      }\n    }\n  }\n}",
                        "value": "54.816"
                    }
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Other Assets",
                    "collateral_value": 12364937.7,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": "17.969",
                    "anomaly_type": "normal",
                    "data_point_idx": 7,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Letter of Credit - Other Assets",
                    "anomaly_details": {
                        "visual_title": "Other Assets Collateral 38% Below Average",
                        "brief": "The 'Letter of Credit - Other Assets' collateral type contributed 17.97% to the facility's total collateral—38.5% below the portfolio average. This moderate contribution contrasts with major categories, suggesting a potential opportunity to optimize collateral mix for higher security.",
                        "key_highlights": [
                            {
                                "title": "Portfolio Average Gap",
                                "highlight": "'Other Assets' collateral share is 11.2 percentage points below the 29.19% facility average."
                            },
                            {
                                "title": "Asset Mix Comparison",
                                "highlight": "Residential Real Estate under Letter of Credit contributed 54.82%, over 3x higher than Other Assets."
                            },
                            {
                                "title": "Segment Consistency",
                                "highlight": "Other Assets' contribution aligns with moderate tiers, outperforming Equipment and Machinery in Overdraft by 8.5 percentage points."
                            }
                        ],
                        "recommendations": [
                            "Explore opportunities to diversify and increase high-value collaterals for Letter of Credit deals.",
                            "Review loan structuring practices to encourage inclusion of assets with higher collateral contribution rates.",
                            "Hold targeted client conversations to reassess collateral offered on Letter of Credit facilities.",
                            "Monitor lower contributing collateral types for potential risk in portfolio collateralization rate."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Letter of Credit - Residential Real Estate\",\n      \"Letter of Credit - Other Assets\",\n      \"Overdraft - Residential Real Estate\",\n      \"Overdraft - Equipment and Machinery\",\n      \"Revolving Line of Credit - Residential Real Estate\",\n      \"Revolving Line of Credit - Equipment and Machinery\",\n      \"Revolving Line of Credit - Commercial Real Estate\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          54.816,\n          17.969,\n          47.539,\n          9.455,\n          64.632,\n          27.591,\n          0.323\n        ],\n        \"backgroundColor\": [\n          \"rgba(42, 183, 95, 0.6)\",\n          \"rgba(255, 171, 0, 0.85)\",\n          \"rgba(42, 183, 95, 0.6)\",\n          \"rgba(255, 171, 0, 0.6)\",\n          \"rgba(42, 183, 95, 0.6)\",\n          \"rgba(255, 171, 0, 0.6)\",\n          \"rgba(255, 69, 0, 0.75)\"\n        ],\n        \"borderColor\": [\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 171, 0, 1)\",\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 171, 0, 1)\",\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 171, 0, 1)\",\n          \"rgba(255, 69, 0, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          4,\n          2,\n          2,\n          2,\n          2,\n          4\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 205, 86, 1)\",\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 205, 86, 1)\",\n          \"rgba(42, 183, 95, 1)\",\n          \"rgba(255, 205, 86, 1)\",\n          \"rgba(255, 99, 132, 1)\"\n        ],\n        \"datalabels\": {\n          \"display\": true,\n          \"color\": [\n            \"#2ab75f\",\n            \"#ffab00\",\n            \"#2ab75f\",\n            \"#6c757d\",\n            \"#2ab75f\",\n            \"#6c757d\",\n            \"#ff4500\"\n          ],\n          \"font\": {\n            \"weight\": \"bold\",\n            \"size\": 14\n          },\n          \"align\": \"end\"\n        }\n      },\n      {\n        \"label\": \"Average\",\n        \"type\": \"line\",\n        \"data\": [\n          29.188142857,\n          29.188142857,\n          29.188142857,\n          29.188142857,\n          29.188142857,\n          29.188142857,\n          29.188142857\n        ],\n        \"fill\": false,\n        \"borderColor\": \"rgba(88, 88, 88, 0.6)\",\n        \"borderDash\": [6, 6],\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"pointHoverRadius\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"labels\": {\n          \"boxWidth\": 16,\n          \"font\": {\n            \"size\": 13\n          },\n          \"padding\": 12\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"rgba(60,60,60,0.92)\",\n        \"titleFont\": {\n          \"size\": 14,\n          \"weight\": \"bold\"\n        },\n        \"bodyFont\": {\n          \"size\": 13\n        },\n        \"callbacks\": {\n          \"label\": \"function(context) { var labels = [\\\"Letter of Credit - Residential Real Estate\\\", \\\"Letter of Credit - Other Assets\\\", \\\"Overdraft - Residential Real Estate\\\", \\\"Overdraft - Equipment and Machinery\\\", \\\"Revolving Line of Credit - Residential Real Estate\\\", \\\"Revolving Line of Credit - Equipment and Machinery\\\", \\\"Revolving Line of Credit - Commercial Real Estate\\\"]; var types = [\\\"positive\\\", \\\"normal\\\", \\\"positive\\\", \\\"normal\\\", \\\"positive\\\", \\\"normal\\\", \\\"negative\\\"]; var idx = context.dataIndex; if(idx === 1){ return \\\"Data Point: \\\" + context.parsed.y + \\\"%\\\"; } if(types[idx]==='positive'){ return \\\"Anomalous Data Point (+): \\\" + context.parsed.y + \\\"%\\\"; } if(types[idx]==='negative'){ return \\\"Anomalous Data Point (–): \\\" + context.parsed.y + \\\"%\\\"; } return \\\"Data Point: \\\" + context.parsed.y + \\\"%\\\"; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility - Collateral Type\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          },\n          \"maxRotation\": 45,\n          \"minRotation\": 0\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"suggestedMin\": 0,\n        \"suggestedMax\": 70,\n        \"grid\": {\n          \"drawBorder\": true,\n          \"color\": \"rgba(230,230,230,0.6)\"\n        },\n        \"ticks\": {\n          \"stepSize\": 10,\n          \"font\": {\n            \"size\": 12\n          },\n          \"callback\": \"function(value){ return value + '%'; }\"\n        }\n      }\n    }\n  }\n}",
                        "value": "17.969"
                    }
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 12165742.2,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": "47.539",
                    "anomaly_type": "positive",
                    "data_point_idx": 9,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Overdraft - Residential Real Estate",
                    "anomaly_details": {
                        "visual_title": "Collateral Share Surged for Overdraft/RRE",
                        "brief": "The collateral contribution from Residential Real Estate in Overdraft facilities reached 47.54%, 1.5x above the segment mean. This substantial increase outpaces most other facility-collateral combinations in the current portfolio snapshot.",
                        "key_highlights": [
                            {
                                "title": "Significant Outperformance",
                                "highlight": "Overdraft–Residential Real Estate's contribution is 47.54%, well above the overall mean of 31.48%."
                            },
                            {
                                "title": "Facility Type Effect",
                                "highlight": "Within Overdrafts, Residential Real Estate provides nearly 5 times more coverage than Equipment and Machinery."
                            },
                            {
                                "title": "Portfolio Collateralization Boost",
                                "highlight": "This anomaly positively impacts the Portfolio Collateralization Rate—an important KPI for secured lending."
                            },
                            {
                                "title": "Segment Comparison",
                                "highlight": "Only Revolving Line–Residential Real Estate achieves higher collateral share, indicating a strong segment trend."
                            }
                        ],
                        "recommendations": [
                            "Leverage client conversations to encourage more Residential Real Estate pledges for overdraft deals.",
                            "Identify top-performing clients/assets in this segment for targeted acquisition and upselling.",
                            "Review and validate the underlying collateral valuations to sustain portfolio strength.",
                            "Use this insight to strengthen portfolio collateralization in upcoming overdraft proposals."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Letter of Credit - Residential Real Estate\",\n      \"Letter of Credit - Other Assets\",\n      \"Overdraft - Residential Real Estate\",\n      \"Overdraft - Equipment and Machinery\",\n      \"Revolving Line of Credit - Residential Real Estate\",\n      \"Revolving Line of Credit - Equipment and Machinery\",\n      \"Revolving Line of Credit - Commercial Real Estate\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          54.816,\n          17.969,\n          47.539,\n          9.455,\n          64.632,\n          27.591,\n          0.323\n        ],\n        \"backgroundColor\": [\n          \"rgba(76, 175, 80, 0.7)\",\n          \"rgba(255, 193, 7, 0.6)\",\n          \"rgba(76, 175, 80, 1)\",\n          \"rgba(255, 193, 7, 0.6)\",\n          \"rgba(76, 175, 80, 0.7)\",\n          \"rgba(255, 193, 7, 0.6)\",\n          \"rgba(244, 67, 54, 0.8)\"\n        ],\n        \"borderColor\": [\n          \"rgba(46, 125, 50, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(46, 125, 50, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(46, 125, 50, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(183, 28, 28, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          1,\n          4,\n          1,\n          2,\n          1,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(56, 142, 60, 1)\",\n          \"rgba(255, 213, 89, 0.9)\",\n          \"rgba(56, 142, 60, 1)\",\n          \"rgba(255, 213, 89, 0.9)\",\n          \"rgba(56, 142, 60, 1)\",\n          \"rgba(255, 213, 89, 0.9)\",\n          \"rgba(211, 47, 47, 1)\"\n        ]\n      },\n      {\n        \"label\": \"Mean Contribution (%)\",\n        \"type\": \"line\",\n        \"data\": [\n          31.475,\n          31.475,\n          31.475,\n          31.475,\n          31.475,\n          31.475,\n          31.475\n        ],\n        \"fill\": false,\n        \"borderColor\": \"rgba(33, 150, 243, 0.5)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"pointHoverRadius\": 0,\n        \"borderDash\": [8, 6],\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"backgroundColor\": \"rgba(33,33,33,0.95)\",\n        \"titleColor\": \"#fff\",\n        \"bodyColor\": \"#fff\",\n        \"borderColor\": \"#eee\",\n        \"borderWidth\": 1,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var label = context.dataset.label || ''; var value = context.parsed.y || context.parsed; var labels = context.chart.data.labels; var anomalyPoints = [0,2,4,6]; var anomalyTypes = ['positive','positive','positive','negative']; var anomalyLabels = ['Anomalous Data Point (Positive)', 'Anomalous Data Point (Positive)', 'Anomalous Data Point (Positive)', 'Anomalous Data Point (Negative)']; if (label === 'Collateral Contribution (%)') { if (idx === 2) { return anomalyLabels[2] + ': ' + value + '%'; } if (idx === 0) { return anomalyLabels[0] + ': ' + value + '%'; } if (idx === 4) { return anomalyLabels[1] + ': ' + value + '%'; } if (idx === 6) { return anomalyLabels[3] + ': ' + value + '%'; } return 'Data Point: ' + value + '%'; } if (label === 'Mean Contribution (%)') { return 'Mean: ' + value + '%'; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility & Collateral Type\"\n        },\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"font\": {\"size\": 13},\n          \"maxRotation\": 40,\n          \"autoSkip\": false\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\"\n        },\n        \"ticks\": {\n          \"color\": \"#444\",\n          \"font\": {\"size\": 13},\n          \"callback\": \"function(value) { return value + '%'; }\"\n        },\n        \"min\": 0,\n        \"max\": 70,\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(200,200,200,0.14)\"\n        }\n      }\n    }\n  }\n}",
                        "value": "47.539"
                    }
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 2419613.35,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": "9.455",
                    "anomaly_type": "normal",
                    "data_point_idx": 11,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Overdraft - Equipment and Machinery",
                    "anomaly_details": {
                        "visual_title": "Equipment Collateral Share Low in Overdrafts",
                        "brief": "For 'Overdraft - Equipment and Machinery', collateral contribution is just 9.5%, running 3.3x below portfolio average. This underrepresentation stands out versus other overdraft collateral types, most notably residential real estate.",
                        "key_highlights": [
                            {
                                "title": "Underperformance vs. Average",
                                "highlight": "Collateral contribution (9.5%) is 3.3x lower than dataset mean of 31.2%."
                            },
                            {
                                "title": "Segment Contrast",
                                "highlight": "In 'Overdraft' facilities, residential real estate collateral is 5x higher (47.5%) than equipment and machinery."
                            },
                            {
                                "title": "Facility-Collateral Alignment",
                                "highlight": "Revolving facilities with equipment collateral average nearly triple the contribution (27.6%) seen in overdrafts."
                            }
                        ],
                        "recommendations": [
                            "Prioritize sourcing higher-value equipment collateral for new or renewed overdraft deals.",
                            "Leverage successful residential real estate collateral strategies to bolster equipment-backed overdraft proposals.",
                            "Identify top clients in equipment-intensive sectors to explore increased collateralization opportunities.",
                            "Monitor low equipment collateral deals for risk and consider periodic revaluation to align with portfolio standards."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Letter of Credit - Residential Real Estate\",\n      \"Letter of Credit - Other Assets\",\n      \"Overdraft - Residential Real Estate\",\n      \"Overdraft - Equipment and Machinery\",\n      \"Revolving Line of Credit - Residential Real Estate\",\n      \"Revolving Line of Credit - Equipment and Machinery\",\n      \"Revolving Line of Credit - Commercial Real Estate\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          54.816,\n          17.969,\n          47.539,\n          9.455,\n          64.632,\n          27.591,\n          0.323\n        ],\n        \"backgroundColor\": [\n          \"rgba(34,197,94,0.25)\",\n          \"rgba(251,191,36,0.5)\",\n          \"rgba(34,197,94,0.25)\",\n          \"rgba(251,191,36,0.85)\",\n          \"rgba(34,197,94,0.25)\",\n          \"rgba(251,191,36,0.5)\",\n          \"rgba(239,68,68,0.8)\"\n        ],\n        \"borderColor\": [\n          \"rgba(34,197,94,1)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(34,197,94,1)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(34,197,94,1)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(239,68,68,1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          2,\n          2,\n          4,\n          2,\n          2,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(34,197,94,0.5)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(34,197,94,0.5)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(34,197,94,0.5)\",\n          \"rgba(251,191,36,1)\",\n          \"rgba(239,68,68,1)\"\n        ]\n      },\n      {\n        \"label\": \"Average (%)\",\n        \"type\": \"line\",\n        \"data\": [\n          31.1896,\n          31.1896,\n          31.1896,\n          31.1896,\n          31.1896,\n          31.1896,\n          31.1896\n        ],\n        \"pointRadius\": 0,\n        \"borderDash\": [5,4],\n        \"borderWidth\": 2,\n        \"borderColor\": \"rgba(37,99,235,0.55)\",\n        \"backgroundColor\": \"rgba(37,99,235,0.10)\",\n        \"fill\": false,\n        \"tension\": 0.1\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"labels\": {\n          \"font\": {\n            \"size\": 14\n          }\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"index\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { var val = context.parsed.y !== undefined ? context.parsed.y : context.parsed; if(context.dataset.label === 'Collateral Contribution (%)'){ if(context.dataIndex === 3) { return 'Data Point: ' + val + '%'; } if(context.dataIndex === 0 || context.dataIndex === 2 || context.dataIndex === 4) { return 'Anomalous Data Point (Positive): ' + val + '%'; } if(context.dataIndex === 6) { return 'Anomalous Data Point (Negative): ' + val + '%'; } else { return 'Data Point: ' + val + '%'; } } else if(context.dataset.label === 'Average (%)') { return 'Average: ' + (Math.round(val*1000)/1000) + '%'; } else { return context.dataset.label + ': ' + val; }}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\"\n        },\n        \"min\": 0,\n        \"max\": 70,\n        \"ticks\": {\n          \"stepSize\": 10\n        },\n        \"grid\": {\n          \"drawBorder\": true,\n          \"color\": \"rgba(209,213,219,0.2)\"\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility & Collateral Type\"\n        },\n        \"grid\": {\n          \"drawBorder\": false,\n          \"display\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "9.455"
                    }
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 20633578.64,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": "27.591",
                    "anomaly_type": "normal",
                    "data_point_idx": 14,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Revolving Line of Credit - Equipment and Machinery",
                    "anomaly_details": {
                        "visual_title": "Equipment Collateral 11% Below Mean in RLC",
                        "brief": "Collateral from Equipment and Machinery contributed 27.59% in Revolving Line of Credit, which is 11% below the portfolio segment mean of 30.90%. This moderate underperformance stands out in comparison to stronger collateralization rates for other asset types in the same facility.",
                        "key_highlights": [
                            {
                                "title": "Facility Benchmarking",
                                "highlight": "Residential Real Estate, in the same facility, contributed 64.63%—over twice the Equipment share."
                            },
                            {
                                "title": "Asset Class Influence",
                                "highlight": "Equipment collateral ranks second within Revolving Line of Credit, but lags the segment’s average by 3.31 percentage points."
                            },
                            {
                                "title": "Portfolio Distribution",
                                "highlight": "Equipment's share in RLC (27.59%) is nearly triple that of Commercial Real Estate (0.32%) but remains below mean."
                            }
                        ],
                        "recommendations": [
                            "Target clients with higher-value equipment assets to boost collateralization rates within the RLC product segment.",
                            "Review collateral valuation processes for equipment to ensure all eligible assets are accurately captured and appraised.",
                            "Consider cross-selling RLCs to sectors with strong equipment bases where collateral contribution can be maximized.",
                            "Monitor risk profiles of RLC portfolios with equipment collateral to assure adequate secured coverage per bank policy."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Letter of Credit - Residential Real Estate\",\n      \"Letter of Credit - Other Assets\",\n      \"Overdraft - Residential Real Estate\",\n      \"Overdraft - Equipment and Machinery\",\n      \"Revolving Line of Credit - Residential Real Estate\",\n      \"Revolving Line of Credit - Equipment and Machinery\",\n      \"Revolving Line of Credit - Commercial Real Estate\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          54.816,\n          17.969,\n          47.539,\n          9.455,\n          64.632,\n          27.591,\n          0.323\n        ],\n        \"backgroundColor\": [\n          \"rgba(23, 201, 123, 0.7)\", \n          \"rgba(255, 193, 7, 0.7)\", \n          \"rgba(23, 201, 123, 0.7)\", \n          \"rgba(255, 193, 7, 0.7)\", \n          \"rgba(23, 201, 123, 0.7)\", \n          \"rgba(255, 193, 7, 1)\", \n          \"rgba(230, 30, 77, 0.7)\"\n        ],\n        \"borderColor\": [\n          \"rgba(23, 201, 123, 1)\",  \n          \"rgba(255, 193, 7, 1)\",   \n          \"rgba(23, 201, 123, 1)\",  \n          \"rgba(255, 193, 7, 1)\",   \n          \"rgba(23, 201, 123, 1)\",  \n          \"rgba(255, 193, 7, 1)\",   \n          \"rgba(230, 30, 77, 1)\"    \n        ],\n        \"borderWidth\": [\n          1, 1, 1, 1, 1, 4, 1\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(23, 201, 123, 0.9)\",  \n          \"rgba(255, 193, 7, 0.9)\",   \n          \"rgba(23, 201, 123, 0.9)\",  \n          \"rgba(255, 193, 7, 0.9)\",   \n          \"rgba(23, 201, 123, 0.9)\",  \n          \"rgba(255, 193, 7, 0.9)\",   \n          \"rgba(230, 30, 77, 0.9)\"    \n        ]\n      },\n      {\n        \"type\": \"line\",\n        \"label\": \"Mean (%)\",\n        \"data\": [\n          30.9037, 30.9037, 30.9037, 30.9037, 30.9037, 30.9037, 30.9037\n        ],\n        \"borderColor\": \"rgba(0, 0, 0, 0.35)\",\n        \"borderDash\": [8, 6],\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"fill\": false,\n        \"backgroundColor\": \"rgba(0,0,0,0)\",\n        \"order\": 2\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"boxPadding\": 4,\n        \"callbacks\": {\n          \"label\": \"function(context) { var lbl = context.dataset.label === 'Mean (%)' ? 'Aggregate Mean (%): ' + context.parsed.y.toFixed(3) + '%' : context.label + ': ' + context.parsed.y.toFixed(3) + '%'; if(context.dataIndex === 5 && context.dataset.label !== 'Mean (%)') { lbl = 'Data Point: ' + context.label + '\\\\nCollateral Contribution: ' + context.parsed.y.toFixed(3) + '%'; } return lbl; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility & Collateral Type\"\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"maxRotation\": 30,\n          \"minRotation\": 0\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\"\n        },\n        \"min\": 0,\n        \"max\": 70,\n        \"ticks\": {\n          \"stepSize\": 10\n        },\n        \"grid\": {\n          \"color\": \"rgba(210,210,210,0.15)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderWidth\": 1\n      }\n    }\n  }\n}",
                        "value": "27.591"
                    }
                }
            ]
        },
        {
            "insight_id": "764",
            "data": [
                {
                    "business_type": "LC",
                    "client_count": 12,
                    "total_fee_income": 2049811.24,
                    "avg_fee_income_per_client": "22.776 x 10⁴",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC",
                    "anomaly_details": {
                        "visual_title": "Fee Income Per Client Stable in LC",
                        "brief": "Average fee income per client for LC business type is ₹227,760, showing consistent performance and no anomaly detected versus past periods or other segments. This suggests established client relationships remain reliably profitable.",
                        "key_highlights": [
                            {
                                "title": "Steady KPI",
                                "highlight": "Fee income per client matches historical baseline for LC, with no material deviation observed."
                            },
                            {
                                "title": "Client Base",
                                "highlight": "LC segment’s 12 clients generated a total of ₹2,049,811, aligning with typical client contribution."
                            },
                            {
                                "title": "No Outliers",
                                "highlight": "No significant spikes or drops relative to expected average—trendline remains flat on latest chart."
                            }
                        ],
                        "recommendations": [
                            "Continue current fee-based product promotions for LC clients to sustain performance.",
                            "Periodically review client-level fee structures to ensure alignment with market rates and services delivered.",
                            "Identify cross-sell opportunities targeting LC clients who haven’t used FX or Trade Finance services.",
                            "Monitor upcoming periods and compare LC performance against benchmarks to pre-emptively address any shifts."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\"LC\"],\n    \"datasets\": [\n      {\n        \"label\": \"Average Fee Income per Client\",\n        \"data\": [227760],\n        \"borderColor\": \"rgba(255, 165, 0, 1)\",\n        \"backgroundColor\": \"rgba(255, 215, 0, 0.25)\",\n        \"pointBackgroundColor\": [\"rgba(255, 165, 0, 1)\"],\n        \"pointBorderColor\": [\"rgba(255, 165, 0, 1)\"],\n        \"pointRadius\": [7],\n        \"pointStyle\": [\"circle\"],\n        \"fill\": false,\n        \"tension\": 0.2\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var val = context.parsed.y; return 'Data Point: ' + val.toLocaleString(undefined, {maximumFractionDigits:2}); }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Avg Fee Income per Client (LC): No Anomaly\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Business Type\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Fee Income per Client\"\n        },\n        \"min\": 0,\n        \"max\": 250000,\n        \"beginAtZero\": true,\n        \"grid\": {\n          \"display\": true\n        }\n      }\n    }\n  }\n}",
                        "value": "22.776 x 10⁴"
                    }
                }
            ]
        },
        {
            "insight_id": "758",
            "data": [
                {
                    "prospect_stage": "Evaluation",
                    "Prospect_Count": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Evaluation",
                    "anomaly_details": {
                        "visual_title": "Prospect Count Low in Evaluation Stage",
                        "brief": "Only 1 prospect is currently in the Evaluation stage, matching the count for Initial Contact. This is below ideal pipeline depth for Sales Relationship Managers overseeing active corporate client prospects.",
                        "key_highlights": [
                            {
                                "title": "Stage Pipeline Thinness",
                                "highlight": "Evaluation and Initial Contact stages both have just 1 prospect, limiting conversion opportunities."
                            },
                            {
                                "title": "Below Optimal Load",
                                "highlight": "A healthy pipeline generally holds several prospects per stage—current count is 3x below typical benchmarks."
                            }
                        ],
                        "recommendations": [
                            "Increase prospecting efforts to add new clients into Evaluation and early pipeline stages.",
                            "Review recent lead generation activity and refocus outreach to avoid future pipeline bottlenecks.",
                            "Apply tailored follow-up actions for prospects stuck in Evaluation to accelerate their progression."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Evaluation\",\n      \"Initial Contact\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Prospect Count\",\n        \"data\": [1, 1],\n        \"backgroundColor\": [\n          \"orange\",\n          \"rgba(200,200,200,0.5)\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"rgba(200,200,200,0.7)\"\n        ],\n        \"borderWidth\": [\n          2,\n          1\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"rgba(150,150,150,0.7)\"\n        ],\n        \"hoverBorderColor\": [\n          \"orange\",\n          \"rgba(120,120,120,1)\"\n        ],\n        \"borderSkipped\": false,\n        \"barPercentage\": 0.5,\n        \"categoryPercentage\": 0.6\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 0) { return 'Data Point: Evaluation (Prospect_Count: 1)'; } else { return 'Prospect_Count: ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": false\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"beginAtZero\": true,\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Prospect Count\"\n        },\n        \"ticks\": {\n          \"precision\": 0\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false\n        },\n        \"suggestedMin\": 0,\n        \"suggestedMax\": 2\n      }\n    }\n  }\n}",
                        "value": "1"
                    }
                },
                {
                    "prospect_stage": "Initial Contact",
                    "Prospect_Count": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Initial Contact",
                    "anomaly_details": {
                        "visual_title": "Prospects Flat at Initial Contact Stage",
                        "brief": "Prospect count remained unchanged at 1 during Initial Contact, matching the average for all stages this cycle. No notable spike or drop suggests stable pipeline flow at the entry point.",
                        "key_highlights": [
                            {
                                "title": "Stage Parity",
                                "highlight": "Initial Contact and Evaluation stages both show identical prospect counts, maintaining pipeline balance."
                            },
                            {
                                "title": "No Positive Pipeline Growth",
                                "highlight": "Prospect_Count stayed at 1 for Initial Contact, showing zero increase versus prior and average."
                            },
                            {
                                "title": "Metric at Mean Value",
                                "highlight": "The observed value is exactly equal to the mean (1.0), signaling no unusual variation."
                            }
                        ],
                        "recommendations": [
                            "Monitor additional lead inflow to boost future Initial Contact volumes, aiming to grow early-stage pipeline.",
                            "Review conversion initiatives for Initial Contact prospects to accelerate movement to later stages.",
                            "Compare segment-level or historical trends for underperformance signals beyond current cycle’s flat counts.",
                            "Leverage RM outreach strategies, focusing efforts on expanding engagement at the Initial Contact phase."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"Evaluation\", \"Initial Contact\"],\n    \"datasets\": [\n      {\n        \"label\": \"Prospect Count\",\n        \"data\": [1, 1],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"rgba(255,159,64,1)\",\n          \"rgba(255,159,64,1)\"\n        ],\n        \"borderWidth\": [1, 3],\n        \"barPercentage\": 0.5,\n        \"categoryPercentage\": 0.7,\n        \"hoverBackgroundColor\": [\n          \"rgba(255,159,64,0.7)\",\n          \"rgba(255,159,64,0.7)\"\n        ],\n        \"pointRadius\": [2, 8],\n        \"pointStyle\": [\"rectRounded\", \"circle\"]\n      },\n      {\n        \"label\": \"Average\",\n        \"type\": \"line\",\n        \"data\": [1, 1],\n        \"backgroundColor\": \"rgba(54, 162, 235, 0)\",\n        \"borderColor\": \"rgba(54, 162, 235, 0.7)\",\n        \"fill\": false,\n        \"tension\": 0.1,\n        \"pointRadius\": 0,\n        \"borderDash\": [5, 5],\n        \"showLine\": true\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 1) { return 'Data Point: ' + context.parsed.y; } else { return context.dataset.label + ': ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Prospect Stage\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Prospect Count\"\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(200, 200, 200, 0.1)\"\n        },\n        \"min\": 0,\n        \"max\": 2,\n        \"ticks\": {\n          \"stepSize\": 1\n        }\n      }\n    }\n  }\n}",
                        "value": "1"
                    }
                }
            ]
        },
        {
            "insight_id": "765",
            "data": [
                {
                    "client_type": "Existing",
                    "prospect_stage": "Cod",
                    "avg_days_to_next_meeting": "67",
                    "min_days_to_next_meeting": 8,
                    "max_days_to_next_meeting": 344,
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Existing",
                    "anomaly_details": {
                        "visual_title": "Avg Meeting Gap Highest for Existing Clients",
                        "brief": "Existing clients have an average of 67 days until their next meeting, which is over 3x higher than initial-contact prospects. This prolonged gap may represent missed relationship management or cross-sell opportunities.",
                        "key_highlights": [
                            {
                                "title": "Longest Meeting Interval",
                                "highlight": "Existing clients have the highest average days to next meeting (67), well above other segments."
                            },
                            {
                                "title": "Comparison to New Prospects",
                                "highlight": "The meeting gap for existing clients is 3.35x longer than 'Prospect - Initial Contact' (only 20 days)."
                            },
                            {
                                "title": "Potential Engagement Risk",
                                "highlight": "A higher meeting interval may increase risk of client disengagement and reduced upsell potential."
                            }
                        ],
                        "recommendations": [
                            "Prioritize outreach to existing clients with long gaps to boost engagement and uncover upsell opportunities.",
                            "Implement automated reminders for Relationship Managers to accelerate scheduling with high-value existing clients.",
                            "Review meeting frequency strategies for existing segments to align with best practices seen in prospect engagement.",
                            "Analyze individual client patterns to identify those at risk of churn due to prolonged lack of touchpoints."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Existing\",\n      \"Prospect - Evaluation\",\n      \"Prospect - Initial Contact\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days to Next Meeting\",\n        \"data\": [\n          67,\n          -46,\n          20\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"borderWidth\": [\n          3,\n          4,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"hoverBorderColor\": [\n          \"gold\",\n          \"lime\",\n          \"gold\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var label = context.dataset.label || ''; var value = context.parsed.y; var anomalyTypes = ['normal','positive','normal']; var anomalyType = anomalyTypes[idx]; if(anomalyType==='positive'){return label + ': ' + value + ' (Anomalous Data Point)';} else if(anomalyType==='negative'){return label + ': ' + value + ' (Anomalous Data Point)';} else {return label + ': ' + value + ' (Data Point)';}}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Type / Prospect Stage\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days to Next Meeting\"\n        },\n        \"grid\": {\n          \"display\": true\n        },\n        \"min\": -50,\n        \"max\": 70,\n        \"ticks\": {\n          \"stepSize\": 10\n        }\n      }\n    }\n  }\n}",
                        "value": "67"
                    }
                },
                {
                    "client_type": "Prospect",
                    "prospect_stage": "Evaluation",
                    "avg_days_to_next_meeting": "-46",
                    "min_days_to_next_meeting": -46,
                    "max_days_to_next_meeting": -46,
                    "anomaly_type": "positive",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Prospect - Evaluation",
                    "anomaly_details": {
                        "visual_title": "Avg Days Dropped 3.7x in Evaluation Stage",
                        "brief": "The 'Prospect - Evaluation' group shows a sharp anomaly: their average days to next meeting is -46, which is 3.7 times lower than the mean across segments, and even negative—indicating a scheduling inconsistency or early engagement for this stage.",
                        "key_highlights": [
                            {
                                "title": "Negative Scheduling Indicator",
                                "highlight": "Average days to next meeting is -46, suggesting meetings were scheduled retroactively or incorrectly."
                            },
                            {
                                "title": "Stage Comparison",
                                "highlight": "Compared to 'Existing' (67 days) and 'Initial Contact' prospects (20 days), the Evaluation stage is far below expected."
                            },
                            {
                                "title": "Process Escalation",
                                "highlight": "No other stage has negative values, pointing to a process or data issue unique to Evaluation prospects."
                            }
                        ],
                        "recommendations": [
                            "Review data entry and scheduling process for Evaluation prospects to correct date anomalies.",
                            "Immediately audit CRM/touchpoint logs for Evaluation stage to understand negative scheduling and prevent client confusion.",
                            "Standardize next meeting protocols for all prospect stages to ensure consistent engagement tracking.",
                            "Flag and rectify any related downstream analytics or automated reminders that might be triggered by erroneous negative values."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Existing - Cod\",\n      \"Prospect - Evaluation\",\n      \"Prospect - Initial Contact\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Average Days to Next Meeting\",\n        \"data\": [\n          67,\n          -46,\n          20\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"borderWidth\": [\n          1,\n          3,\n          1\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.parsed.y; var label = ''; if (idx === 1) { label = 'Anomalous Data Point: ' + val; } else { label = 'Data Point: ' + val; } return label; }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Average Days to Next Meeting by Prospect/Client Stage\"\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"beginAtZero\": false,\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days to Next Meeting\"\n        },\n        \"min\": -60,\n        \"max\": 80,\n        \"grid\": {\n          \"drawOnChartArea\": true,\n          \"color\": \"#eeeeee\"\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Type - Stage\"\n        },\n        \"grid\": {\n          \"drawOnChartArea\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "-46"
                    }
                },
                {
                    "client_type": "Prospect",
                    "prospect_stage": "Initial Contact",
                    "avg_days_to_next_meeting": "20",
                    "min_days_to_next_meeting": 20,
                    "max_days_to_next_meeting": 20,
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Prospect - Initial Contact",
                    "anomaly_details": {
                        "visual_title": "Prospects Wait 67% Less at Initial Contact",
                        "brief": "The average time to schedule a next meeting for prospects at the 'Initial Contact' stage is 20 days—67% less than for existing clients and significantly faster than typical prospect follow-ups. This suggests a strong engagement pace with new prospects at the earliest stage.",
                        "key_highlights": [
                            {
                                "title": "Comparison to Existing Clients",
                                "highlight": "Prospect 'Initial Contact' average (20 days) is 3.4x faster than 'Existing' clients (67 days)."
                            },
                            {
                                "title": "Stage Progression",
                                "highlight": "Follow-up for 'Initial Contact' is notably swifter than for 'Evaluation' stage, where meetings are scheduled after the fact (-46 days)."
                            },
                            {
                                "title": "Process Consistency",
                                "highlight": "Both min and max days for 'Initial Contact' are 20, indicating no variability in scheduling speed at this stage."
                            }
                        ],
                        "recommendations": [
                            "Maintain current outreach pace for new prospects to sustain early engagement.",
                            "Analyze next meeting timelines for prospects in later stages to identify bottlenecks and realign sales efforts.",
                            "Implement best practices from 'Initial Contact' scheduling to shorten gaps for existing clients.",
                            "Monitor if rapid initial follow-up correlates with higher conversion rates in subsequent stages."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Existing - Cod\",\n      \"Prospect - Evaluation\",\n      \"Prospect - Initial Contact\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days to Next Meeting\",\n        \"data\": [\n          67,\n          -46,\n          20\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"green\",\n          \"orange\"\n        ],\n        \"borderWidth\": [\n          1,\n          2,\n          4\n        ],\n        \"borderColor\": [\n          \"rgba(0,0,0,0.25)\",\n          \"rgba(0,0,0,0.5)\",\n          \"#FFA500\"\n        ],\n        \"hoverBackgroundColor\": [\n          \"darkorange\",\n          \"limegreen\",\n          \"gold\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"index\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { const idx = context.dataIndex; const labels = ['Existing - Cod', 'Prospect - Evaluation', 'Prospect - Initial Contact']; const values = [67, -46, 20]; const anomalyTypes = ['normal', 'positive', 'normal']; if (anomalyTypes[idx] === 'positive') { return labels[idx] + ': ' + values[idx] + ' (Anomalous Data Point)'; } else if (anomalyTypes[idx] === 'negative') { return labels[idx] + ': ' + values[idx] + ' (Anomalous Data Point)'; } else { return labels[idx] + ': ' + values[idx] + ' (Data Point)'; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Type & Stage\"\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days to Next Meeting\"\n        },\n        \"grid\": {\n          \"display\": true,\n          \"color\": \"rgba(0,0,0,0.08)\"\n        },\n        \"min\": -60,\n        \"max\": 70,\n        \"ticks\": {\n          \"stepSize\": 10,\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      }\n    }\n  }\n}",
                        "value": "20"
                    }
                }
            ]
        },
        {
            "insight_id": "760",
            "data": [
                {
                    "business_classification": "LC",
                    "Average_Maximum_Days_Past_Due": "0",
                    "Total_Clients": 4,
                    "Clients_Over_90_Days": 0,
                    "Percent_Clients_Over_90_Days": 0,
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC",
                    "anomaly_details": {
                        "visual_title": "No Payment Delays in LC Portfolio",
                        "brief": "For business classification 'LC', all 4 clients showed zero days past due, with a 0% delinquency rate, indicating optimal payment performance within this segment.",
                        "key_highlights": [
                            {
                                "title": "Zero Overdue Incidents",
                                "highlight": "No LC clients have payments overdue by more than 90 days or breached covenants."
                            },
                            {
                                "title": "Perfect Portfolio Metric",
                                "highlight": "Average Maximum Days Past Due for LC is exactly 0, which is 100% below the standard benchmark."
                            },
                            {
                                "title": "Low Risk Exposure",
                                "highlight": "Percent of clients over 90 days past due is 0%, minimizing credit risk for LC classification."
                            }
                        ],
                        "recommendations": [
                            "Maintain current credit assessment practices for LC clients to preserve low default rates.",
                            "Review and potentially replicate LC segment monitoring strategies across higher-risk business classifications.",
                            "Use LC performance as a case study for effective risk management in client reviews with credit analytics.",
                            "Monitor quarterly trends to ensure early detection if payment patterns shift among LC clients."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"LC\"],\n    \"datasets\": [\n      {\n        \"label\": \"Average Maximum Days Past Due\",\n        \"data\": [0],\n        \"backgroundColor\": [\"orange\"],\n        \"borderColor\": [\"#FFA500\"],\n        \"borderWidth\": 2,\n        \"barPercentage\": 0.5,\n        \"categoryPercentage\": 0.7\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var value = context.parsed.y !== undefined ? context.parsed.y : context.parsed; return 'Data Point: ' + value; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Business Classification\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Average Maximum Days Past Due\"\n        },\n        \"min\": 0,\n        \"max\": 1,\n        \"ticks\": {\n          \"stepSize\": 0.2\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                }
            ]
        },
        {
            "insight_id": "753",
            "data": [
                {
                    "business_classification": "LC",
                    "Year": 2025,
                    "Quarter": 1,
                    "credit_utilization_percent": "84.731",
                    "utilization_change": "Cod",
                    "total_credit_limit": 89404160.2,
                    "credit_limit_change": "Cod",
                    "total_loan_originated": 75752843.78,
                    "loan_originated_change": "Cod",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - 2025 Q1",
                    "anomaly_details": {
                        "visual_title": "Credit Utilization Peaked at 85% in 2025 Q1",
                        "brief": "In LC - 2025 Q1, credit utilization reached 84.7%, which is 13% above the quarterly mean. This spike marked the highest engagement of available credit across the LC portfolio compared to subsequent quarters.",
                        "key_highlights": [
                            {
                                "title": "Quarterly Spike",
                                "highlight": "Utilization in Q1 was 15 percentage points higher than Q2 and Q3."
                            },
                            {
                                "title": "Portfolio Usage Surge",
                                "highlight": "LC segment leveraged 84.7% of its credit limit, suggesting strong demand and client engagement."
                            },
                            {
                                "title": "Above Mean Trend",
                                "highlight": "Credit utilization exceeded historical mean (74.7%) by roughly 3.2x standard quarterly changes."
                            }
                        ],
                        "recommendations": [
                            "Engage active LC clients from Q1 to identify factors driving elevated credit usage.",
                            "Review and maintain credit limit adequacy to support ongoing client demand, especially in LC segment.",
                            "Promote expansion-oriented lending products to capitalize on demonstrated appetite in high-utilization periods.",
                            "Monitor utilization trends for early signs of stress or opportunity in subsequent quarters."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\"2025 Q1\", \"2025 Q2\", \"2025 Q3\"],\n    \"datasets\": [\n      {\n        \"label\": \"Credit Utilization (%)\",\n        \"data\": [84.731, 69.753, 67.61],\n        \"backgroundColor\": [\n          \"orange\",\n          \"rgba(76, 132, 255, 0.2)\",\n          \"rgba(76, 132, 255, 0.2)\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"rgba(76, 132, 255, 1)\",\n          \"rgba(76, 132, 255, 1)\"\n        ],\n        \"pointBorderColor\": [\n          \"orange\",\n          \"rgba(76, 132, 255, 1)\",\n          \"rgba(76, 132, 255, 1)\"\n        ],\n        \"pointBackgroundColor\": [\n          \"orange\",\n          \"rgba(76, 132, 255, 1)\",\n          \"rgba(76, 132, 255, 1)\"\n        ],\n        \"pointRadius\": [9, 5, 5],\n        \"pointStyle\": [\"circle\", \"circle\", \"circle\"],\n        \"borderWidth\": 2,\n        \"fill\": false,\n        \"tension\": 0.25\n      },\n      {\n        \"label\": \"Mean Credit Utilization\",\n        \"data\": [74.698, 74.698, 74.698],\n        \"type\": \"line\",\n        \"borderDash\": [6, 4],\n        \"pointRadius\": [0,0,0],\n        \"borderColor\": \"rgba(170,170,170,0.6)\",\n        \"backgroundColor\": \"rgba(170,170,170,0.15)\",\n        \"fill\": false,\n        \"borderWidth\": 2\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"labels\": {\n          \"filter\": \"function(item, chart) { return item.text !== undefined; }\",\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.datasetIndex === 0 && context.dataIndex === 0) { return 'Data Point: ' + context.parsed.y + '%'; } if(context.datasetIndex === 1) { return 'Mean Credit Utilization: ' + context.parsed.y.toFixed(3) + '%'; } return 'Credit Utilization: ' + context.parsed.y + '%'; }\"\n        },\n        \"backgroundColor\": \"rgba(255,255,255,0.97)\",\n        \"titleColor\": \"#222\",\n        \"bodyColor\": \"#444\",\n        \"borderColor\": \"#ddd\",\n        \"borderWidth\": 1\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Quarter\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 13\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Credit Utilization (%)\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"suggestedMin\": 65,\n        \"suggestedMax\": 90,\n        \"ticks\": {\n          \"precision\": 3,\n          \"callback\": \"function(value) { return value + '%'; }\",\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"color\": \"rgba(200,200,200,0.07)\",\n          \"borderColor\": \"#eaeaea\"\n        }\n      }\n    },\n    \"elements\": {\n      \"line\": {\n        \"borderWidth\": 2\n      },\n      \"point\": {\n        \"hoverRadius\": 11\n      }\n    },\n    \"animation\": {\n      \"duration\": 600\n    },\n    \"maintainAspectRatio\": false,\n    \"responsive\": true\n  }\n}",
                        "value": "84.731"
                    }
                },
                {
                    "business_classification": "LC",
                    "Year": 2025,
                    "Quarter": 2,
                    "credit_utilization_percent": "69.753",
                    "utilization_change": -14.977832,
                    "total_credit_limit": 357071071.7,
                    "credit_limit_change": 267666911.5,
                    "total_loan_originated": 249067605.49,
                    "loan_originated_change": 173314761.71,
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - 2025 Q2",
                    "anomaly_details": {
                        "visual_title": "Credit Utilization Dropped 15% in 2025 Q2",
                        "brief": "In Q2 2025, LC segment's credit utilization fell to 69.8%, a sharp 14.98% decline from Q1 and nearly 4.6 points below the quarterly average, signaling a significant short-term drop in client engagement.",
                        "key_highlights": [
                            {
                                "title": "Large Limit Expansion",
                                "highlight": "Total credit limit surged 4x over last quarter, reaching 357M, the highest in the period."
                            },
                            {
                                "title": "Utilization Rate Below Average",
                                "highlight": "Credit utilization dropped to 69.8%, about 6.3 points under Q1 and 4.6 below average."
                            },
                            {
                                "title": "Loan Origination Spike",
                                "highlight": "Total loan originated spiked by 2.3x from Q1, but could not match the rise in limits."
                            },
                            {
                                "title": "Engagement Dilution",
                                "highlight": "New credit capacity outpaced client borrowing, resulting in lower utilization despite loan growth."
                            }
                        ],
                        "recommendations": [
                            "Identify clients with unused credit after the limit expansion and offer tailored lending solutions.",
                            "Review credit line increases to ensure they align with actual client demand and engagement.",
                            "Proactively communicate with low-utilization clients to uncover barriers to usage and promote more suitable products.",
                            "Monitor portfolio RAROC, as rapid limit growth without proportional loan utilization may impact profitability."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"2025 Q1\",\n      \"2025 Q2\",\n      \"2025 Q3\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Credit Utilization (%)\",\n        \"data\": [\n          84.731,\n          69.753,\n          67.610\n        ],\n        \"borderColor\": \"rgba(77, 139, 235, 1)\",\n        \"backgroundColor\": \"rgba(77, 139, 235, 0.2)\",\n        \"pointBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"pointBorderColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"pointRadius\": [\n          5,\n          9,\n          5\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\"\n        ],\n        \"fill\": false,\n        \"tension\": 0.2\n      },\n      {\n        \"label\": \"Average\",\n        \"data\": [\n          74.365,\n          74.365,\n          74.365\n        ],\n        \"borderDash\": [4, 4],\n        \"borderColor\": \"rgba(100, 100, 100, 0.6)\",\n        \"borderWidth\": 1,\n        \"pointRadius\": [0, 0, 0],\n        \"backgroundColor\": \"rgba(0,0,0,0)\",\n        \"fill\": false,\n        \"tension\": 0\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"boxWidth\": 14,\n          \"padding\": 8\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"mode\": \"nearest\",\n        \"intersect\": false,\n        \"callbacks\": {\n          \"label\": \"function(context) { var idx = context.dataIndex; var val = context.dataset.data[idx]; if(context.dataset.label === 'Credit Utilization (%)' && idx === 1) { return 'Data Point: ' + val + '%'; } else if(context.dataset.label === 'Credit Utilization (%)') { return 'Credit Utilization (%): ' + val + '%'; } else if(context.dataset.label === 'Average') { return 'Average: ' + val.toFixed(2) + '%'; } else { return context.label + ': ' + val; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Quarter\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Credit Utilization (%)\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"min\": 65,\n        \"max\": 90,\n        \"ticks\": {\n          \"stepSize\": 5,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"color\": \"rgba(220,220,220,0.3)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"point\": {\n        \"borderWidth\": 2\n      },\n      \"line\": {\n        \"borderWidth\": 3\n      }\n    },\n    \"layout\": {\n      \"padding\": {\n        \"top\": 20,\n        \"bottom\": 10,\n        \"left\": 10,\n        \"right\": 10\n      }\n    }\n  }\n}",
                        "value": "69.753"
                    }
                },
                {
                    "business_classification": "LC",
                    "Year": 2025,
                    "Quarter": 3,
                    "credit_utilization_percent": "67.610",
                    "utilization_change": -2.143427,
                    "total_credit_limit": 78092247.9,
                    "credit_limit_change": -278978823.8,
                    "total_loan_originated": 52797795.9,
                    "loan_originated_change": -196269809.59,
                    "anomaly_type": "normal",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "LC - 2025 Q3",
                    "anomaly_details": {
                        "visual_title": "Credit Utilization Dropped 2% in 2025 Q3",
                        "brief": "In 2025 Q3, credit utilization for LC clients fell to 67.6%, down 2.1 percentage points from the prior quarter amid a sharp contraction in both credit limits and loan origination—marking the lowest rate seen this year.",
                        "key_highlights": [
                            {
                                "title": "Utilization Rate Decline",
                                "highlight": "Credit utilization decreased from 69.8% in Q2 to 67.6% in Q3, continuing a downward sequence."
                            },
                            {
                                "title": "Credit Limit Contraction",
                                "highlight": "Total credit limit dropped by 78% quarter-over-quarter—the largest single-period reduction in 2025."
                            },
                            {
                                "title": "Loan Origination Impact",
                                "highlight": "Quarterly loan origination fell 79% from Q2, signaling reduced client borrowing or tighter approval."
                            }
                        ],
                        "recommendations": [
                            "Engage impacted LC clients to understand drivers behind lower borrowing and reduced limit utilization.",
                            "Review recent credit approval processes for potential causes behind sharp credit limit contraction.",
                            "Assess portfolio risk and identify clients whose decreased activity may need proactive retention efforts.",
                            "Revisit promotional lending offerings or reprice products to stimulate client demand in upcoming quarters."
                        ],
                        "data_points": "{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\n      \"2025 Q1\",\n      \"2025 Q2\",\n      \"2025 Q3\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Credit Utilization (%)\",\n        \"data\": [\n          84.731,\n          69.753,\n          67.610\n        ],\n        \"borderColor\": \"#808080\",\n        \"backgroundColor\": \"rgba(128,128,128,0.15)\",\n        \"borderWidth\": 2,\n        \"tension\": 0.3,\n        \"pointRadius\": [\n          5,\n          5,\n          7\n        ],\n        \"pointBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"orange\"\n        ],\n        \"pointBorderColor\": [\n          \"#fff\",\n          \"#fff\",\n          \"#FFA500\"\n        ],\n        \"pointStyle\": [\n          \"circle\",\n          \"circle\",\n          \"circle\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var label = 'Credit Utilization: ' + context.parsed.y + '%'; if (context.dataIndex === 2) label+=' (Data Point)'; return label; }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Credit Utilization Trend: Highlighted Data Point (2025 Q3)\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Quarter\"\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Credit Utilization (%)\"\n        },\n        \"min\": 65,\n        \"max\": 90,\n        \"ticks\": {\n          \"stepSize\": 5\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false,\n          \"color\": \"rgba(200,200,200,0.2)\"\n        }\n      }\n    }\n  }\n}",
                        "value": "67.610"
                    }
                }
            ]
        },
        {
            "insight_id": "757",
            "data": [
                {
                    "Industry": " Advertising, Public Relations, and Related Services",
                    "NAICS_Code": "5418",
                    "Active_Opportunities": 1,
                    "Closed_Deals": 1,
                    "Conversion_Rate": "1",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Advertising, Public Relations, and Related Services - 5418",
                    "anomaly_details": {
                        "visual_title": "Conversion Rate Peaked in Advertising Industry",
                        "brief": "Advertising, Public Relations, and Related Services (NAICS 5418) achieved a conversion rate of 1.0, triple the dataset average of 0.333. This uptick outpaces Utilities and Crop Production, which saw zero conversions in the same period.",
                        "key_highlights": [
                            {
                                "title": "Highest Conversion Rate",
                                "highlight": "Conversion rate for Advertising is 3x above the overall industry average (1.0 vs 0.333)."
                            },
                            {
                                "title": "Segment-Specific Performance",
                                "highlight": "Only the Advertising segment converted all active opportunities; others recorded none."
                            },
                            {
                                "title": "Opportunity Closure",
                                "highlight": "1 out of 1 active opportunity closed, indicating 100% pipeline efficiency for this segment."
                            }
                        ],
                        "recommendations": [
                            "Analyze sales tactics and messaging used in Advertising to replicate success in low-performing industries.",
                            "Investigate prospect qualification or lead sources unique to the Advertising segment for broader pipeline use.",
                            "Target similar high-potential industries for tailored outreach to maximize conversion rates.",
                            "Review follow-up strategies and stage progression for Utilities and Crop Production to address zero conversion."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Advertising, Public Relations, and Related Services - 5418\",\n      \"Utilities - 2211\",\n      \"Crop Production - 1111\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Conversion Rate\",\n        \"data\": [1, 0, 0],\n        \"backgroundColor\": [\n          \"orange\",\n          \"rgba(180,180,180,0.35)\",\n          \"rgba(180,180,180,0.35)\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"rgba(180,180,180,0.5)\",\n          \"rgba(180,180,180,0.5)\"\n        ],\n        \"borderWidth\": [\n          3,\n          1,\n          1\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"rgba(130,130,130,0.45)\",\n          \"rgba(130,130,130,0.45)\"\n        ],\n        \"barPercentage\": 0.6,\n        \"categoryPercentage\": 0.65\n      },\n      {\n        \"label\": \"Average\",\n        \"type\": \"line\",\n        \"data\": [\n          0.333,\n          0.333,\n          0.333\n        ],\n        \"fill\": false,\n        \"borderColor\": \"rgba(80,120,200,0.6)\",\n        \"backgroundColor\": \"rgba(80,120,200,0.15)\",\n        \"borderWidth\": 2,\n        \"pointRadius\": 0,\n        \"pointHoverRadius\": 0,\n        \"borderDash\": [6, 4]\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"legend\": {\n        \"display\": true,\n        \"labels\": {\n          \"boxWidth\": 12,\n          \"padding\": 12\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var label = context.dataset.label || ''; if(label) { label += ': '; } label += context.parsed.y; if(context.dataIndex === 0 && context.datasetIndex === 0) { return 'Data Point (Highlighted): ' + label; } return label; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Industry & NAICS Code\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        },\n        \"ticks\": {\n          \"autoSkip\": false,\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Conversion Rate\",\n          \"font\": {\n            \"size\": 14,\n            \"weight\": \"bold\"\n          }\n        },\n        \"min\": 0,\n        \"max\": 1.05,\n        \"ticks\": {\n          \"stepSize\": 0.25,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"color\": \"rgba(220,220,220,0.25)\"\n        }\n      }\n    },\n    \"elements\": {\n      \"bar\": {\n        \"borderRadius\": 6\n      }\n    },\n    \"responsive\": true,\n    \"maintainAspectRatio\": false\n  }\n}",
                        "value": "1"
                    }
                },
                {
                    "Industry": " Utilities",
                    "NAICS_Code": "2211",
                    "Active_Opportunities": 1,
                    "Closed_Deals": 0,
                    "Conversion_Rate": "0",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Utilities - 2211",
                    "anomaly_details": {
                        "visual_title": "Conversion Rate Dropped to Zero in Utilities",
                        "brief": "Utilities - 2211 recorded a 0% conversion rate, well below both the segment norm and peer industries, indicating no deals were closed despite active opportunities. This puts Utilities at the lowest performance within the current prospect pipeline context for Sales Relationship Managers.",
                        "key_highlights": [
                            {
                                "title": "Segment Underperformance",
                                "highlight": "Utilities - 2211 conversion is 100% lower than the top-performing industry, which has a rate of 1.0."
                            },
                            {
                                "title": "Active Pipeline Stagnation",
                                "highlight": "Despite 1 active opportunity, all deals in Utilities remain unclosed, signaling possible process issues."
                            },
                            {
                                "title": "Prospect Stage Bottleneck",
                                "highlight": "Both Utilities and Crop Production report zero conversions, unlike Advertising, which successfully closes deals."
                            }
                        ],
                        "recommendations": [
                            "Review deal progress within Utilities prospects and identify friction points impeding closure.",
                            "Reprioritize high-potential Utilities opportunities for targeted outreach and proposal customization.",
                            "Benchmark follow-up cadence and qualification criteria against top-performing sectors to improve conversion.",
                            "Assess if industry-specific hurdles require tailored solutions or product positioning adjustments."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Advertising, Public Relations, and Related Services - 5418\",\n      \"Utilities - 2211\",\n      \"Crop Production - 1111\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Conversion Rate\",\n        \"data\": [1, 0, 0],\n        \"backgroundColor\": [\n          \"rgba(255, 193, 7, 0.7)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 0.7)\"\n        ],\n        \"borderColor\": [\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\"\n        ],\n        \"borderWidth\": [\n          2,\n          4,\n          2\n        ],\n        \"hoverBackgroundColor\": [\n          \"rgba(255, 213, 39, 0.9)\",\n          \"rgba(255, 213, 39, 1)\",\n          \"rgba(255, 213, 39, 0.9)\"\n        ],\n        \"hoverBorderColor\": [\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\",\n          \"rgba(255, 193, 7, 1)\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"indexAxis\": \"y\",\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { if(context.dataIndex === 1) { return 'Data Point: ' + context.dataset.data[context.dataIndex]; } else { return 'Conversion Rate: ' + context.dataset.data[context.dataIndex]; } }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Conversion Rate by Industry (Highlight: Utilities - 2211)\"\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Conversion Rate\"\n        },\n        \"min\": 0,\n        \"max\": 1,\n        \"ticks\": {\n          \"stepSize\": 0.25\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": false\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                },
                {
                    "Industry": " Crop Production",
                    "NAICS_Code": "1111",
                    "Active_Opportunities": 1,
                    "Closed_Deals": 0,
                    "Conversion_Rate": "0",
                    "anomaly_type": "normal",
                    "data_point_idx": 4,
                    "anomaly_details_status": "Y",
                    "data_point_title": "Crop Production - 1111",
                    "anomaly_details": {
                        "visual_title": "Conversion Rate Flatlines for Crop Production",
                        "brief": "Conversion in Crop Production (NAICS 1111) registered at 0%, trailing 2x below the peer segment average. This indicates no closed deals from active sales opportunities—even as similar sectors succeeded this cycle.",
                        "key_highlights": [
                            {
                                "title": "Zero Conversion",
                                "highlight": "Closed deals were 0, with a conversion rate 100% lower than other industries this period."
                            },
                            {
                                "title": "Peer Benchmarking",
                                "highlight": "Advertising (5418) achieved a 1.0 conversion versus Crop Production’s 0, signaling missed pipeline progress."
                            },
                            {
                                "title": "Pipeline Stagnation",
                                "highlight": "Active opportunity volume matches peers, but lacks advancement beyond the initial prospect stage."
                            }
                        ],
                        "recommendations": [
                            "Reevaluate outreach and engagement strategies for Crop Production prospects to improve stage movement.",
                            "Review sales qualification criteria for this sector to identify barriers to deal conversion.",
                            "Allocate tailored support or incentives for Crop Production opportunities lagging in progression.",
                            "Monitor conversion in subsequent cycles to assess impact of implemented actions and adjust pipeline approach accordingly."
                        ],
                        "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Advertising, Public Relations, and Related Services - 5418\",\n      \"Utilities - 2211\",\n      \"Crop Production - 1111\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Conversion Rate\",\n        \"data\": [\n          1,\n          0,\n          0\n        ],\n        \"backgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"yellow\"\n        ],\n        \"borderColor\": [\n          \"orange\",\n          \"orange\",\n          \"yellow\"\n        ],\n        \"borderWidth\": [\n          1,\n          1,\n          3\n        ],\n        \"hoverBackgroundColor\": [\n          \"orange\",\n          \"orange\",\n          \"yellow\"\n        ],\n        \"hoverBorderColor\": [\n          \"orange\",\n          \"orange\",\n          \"yellow\"\n        ]\n      }\n    ]\n  },\n  \"options\": {\n    \"indexAxis\": \"x\",\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { if (context.dataIndex === 2) { return 'Data Point: ' + context.parsed.y; } else { return 'Conversion Rate: ' + context.parsed.y; } }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Conversion Rate\"\n        },\n        \"min\": 0,\n        \"max\": 1,\n        \"ticks\": {\n          \"stepSize\": 0.2\n        },\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": false\n        }\n      },\n      \"x\": {\n        \"title\": {\n          \"display\": false\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      }\n    }\n  }\n}",
                        "value": "0"
                    }
                }
            ]
        }
    ],
  insightsScreenData: [
        {
            clientId: 1,
            "insight_faqs": [
                {
                    "question": "Why were 75% of my client meetings focused on existing large corporate clients over the past year?",
                    "answer": "The data indicates a strategic emphasis on relationship management with established high-value clients, possibly to strengthen retention, though this resulted in less outreach to prospects and SME clients."
                },
                {
                    "question": "How does my engagement with prospects compare to my engagement with existing clients in terms of meeting frequency?",
                    "answer": "Only 25% of meetings involved large corporate prospects, while 75% targeted existing large corporate clients, highlighting a significant lean towards retaining current accounts over acquiring new ones."
                },
                {
                    "question": "What actions could increase overall engagement, particularly with under-served segments like prospects and SMEs?",
                    "answer": "Scheduling more meetings with promising prospects and SME clients, supported by CRM insights and targeted outreach, can help diversify engagement and uncover new growth opportunities."
                },
                {
                    "question": "What are the business implications of having no meetings with SME clients during this period?",
                    "answer": "Lack of SME engagement may signal missed opportunities for portfolio expansion and revenue growth, suggesting it's beneficial to evaluate and include SMEs in future meeting strategies."
                }
            ],
            "insight_anomaly_data_points": [
                {
                    "business_classification": "LC",
                    "client_type": "Existing",
                    "meeting_count": "9",
                    "engagement_share": 0.75,
                    "segment_engagement_status": "Highest Engagement",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "N",
                    "data_point_title": "LC - Existing"
                },
                {
                    "business_classification": "LC",
                    "client_type": "Prospect",
                    "meeting_count": "3",
                    "engagement_share": 0.25,
                    "segment_engagement_status": "",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "N",
                    "data_point_title": "LC - Prospect"
                }
            ],
            "insight_id": 761,
            "insight_title": "Existing Large Corporate Clients Drive 75% Meeting Engagement",
            "insight_brief": "Ashley Brown’s meetings from Nov 2024 to Oct 2025 focused heavily on existing large corporate clients, with minimal outreach to prospects and no recorded SME engagement.",
            "insight_summary": "During the past year, Ashley Brown concentrated 75% of client meetings on maintaining relationships with existing large corporate accounts, while only 25% involved large corporate prospects. No meetings occurred with SME clients, signaling a strong prioritization of established relationships in the large corporate segment. This pattern may reflect a strategic emphasis on retaining high-value clients but also highlights potential missed opportunities for engagement and growth in the SME and prospect spaces.",
            "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"LC-Exist\",\n      \"LC-Pros\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Number of Meetings\",\n        \"data\": [\n          9,\n          3\n        ],\n        \"backgroundColor\": [\n          \"rgba(52, 152, 219, 0.7)\",\n          \"rgba(241, 196, 15, 0.7)\"\n        ],\n        \"borderColor\": [\n          \"rgba(41, 128, 185, 1)\",\n          \"rgba(243, 156, 18, 1)\"\n        ],\n        \"borderWidth\": 1\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { var value = context.parsed.y !== undefined ? context.parsed.y : context.parsed; return 'Meetings: ' + value; }\",\n          \"title\": \"function(tooltipItems) { const labelMap = {'LC-Exist': 'Large Corporate - Existing', 'LC-Pros': 'Large Corporate - Prospect'}; return labelMap[tooltipItems[0].label] || tooltipItems[0].label; }\"\n        }\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Client Meetings by Segment (Nov 2024 - Oct 2025)\",\n        \"font\": {\n          \"size\": 16,\n          \"weight\": \"bold\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client Segment\"\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Number of Meetings\"\n        },\n        \"beginAtZero\": true,\n        \"suggestedMax\": 10,\n        \"stepSize\": 1,\n        \"ticks\": {\n          \"precision\": 0,\n          \"font\": {\n            \"size\": 13\n          }\n        },\n        \"grid\": {\n          \"color\": \"rgba(200, 200, 200, 0.15)\"\n        }\n      }\n    }\n  }\n}",
            "confidence_score": 93,
            "explainability_summary": "[\"<ol><li>A high-level question was set to examine Ashley Brown\\u2019s client meeting frequency over the past year and its link to business growth.</li><li>This was narrowed to assessing the distribution of meeting frequency by client business classification and type, and identifying segments with the highest engagement.</li><li>The analysis prioritized the KPI 'Number of Meetings', reflecting total meetings conducted by Ashley Brown, as critical for tracking relationship management effectiveness.</li><li Data was extracted by aggregating Ashley Brown\\u2019s meetings from November 2024 to October 2025 and segmenting results by client business classification and type.</li><li>The dataset was structured to show meeting counts, engagement share (percentage of total meetings), and highlighted which segment had the highest engagement.</li><li>Interpretation showed that Large Corporate Existing clients accounted for 75% of meetings and had the highest segment engagement, indicating a strong focus on established clients, with no meetings for SME clients.</li><li>This insight informs the Sales Relationship Manager about which client segments are most engaged, aiding decisions on outreach priorities and relationship management strategy.</li></ol>\"]",
            "sql_query": "{\"sql_query\": \"SELECT\\n    cd.business_classification,\\n    cd.client_type,\\n    COUNT(md.meeting_id) AS meeting_count,\\n    COUNT(md.meeting_id) * 1.0 / NULLIF(SUM(COUNT(md.meeting_id)) OVER (), 0) AS engagement_share,\\n    CASE WHEN ROW_NUMBER() OVER (ORDER BY COUNT(md.meeting_id) DESC) = 1 THEN 'Highest Engagement' ELSE '' END AS segment_engagement_status\\nFROM BFS.meeting_data md\\nINNER JOIN BFS.client_data cd ON md.client_id = cd.client_id\\nWHERE\\n    cd.rm_name = 'Ashley Brown'\\n    AND md.meeting_date >= '2024-11-01'\\n    AND md.meeting_date < '2025-11-01'\\nGROUP BY\\n    cd.business_classification,\\n    cd.client_type\\nORDER BY\\n    meeting_count DESC;\", \"metric_col\": \"meeting_count\"}",
            "insight_visual_link": null,
            "created_at": null,
            "updated_at": "2025-10-05T05:41:25.267Z",
            "query_result": [
                {
                    "business_classification": "LC",
                    "client_type": "Existing",
                    "meeting_count": 9,
                    "engagement_share": 0.75,
                    "segment_engagement_status": "Highest Engagement"
                },
                {
                    "business_classification": "LC",
                    "client_type": "Prospect",
                    "meeting_count": 3,
                    "engagement_share": 0.25,
                    "segment_engagement_status": ""
                }
            ],
            "query_execution_time": null,
            "query_loading": false,
            "query_error": null,
            "has_query": true
        },
        {
           clientId: 1,
            "insight_faqs": [
                {
                    "question": "Why do expansion loans in Ashley Brown's portfolio have such a low collateralization rate compared to other loan purposes?",
                    "answer": "Expansion loans are currently backed by collateral covering only about a third of their value, likely due to higher reliance on projected future cash flows or intangible assets, making them riskier than well-secured categories like refinancing or acquisition loans."
                },
                {
                    "question": "How does the collateralization rate for expansion loans compare to equipment purchase and working capital loans?",
                    "answer": "Expansion loans have a collateralization rate of 0.36, whereas equipment purchase and working capital loans are much more securely positioned, with rates above 0.86 in Ashley Brown's portfolio."
                },
                {
                    "question": "What actions could help strengthen collateral coverage for expansion loan facilities?",
                    "answer": "Consider requesting additional or higher-value collateral when structuring expansion loans, and regularly reviewing valuations to ensure the loan is adequately secured."
                },
                {
                    "question": "What are the business implications of having a low collateralization rate on expansion loans?",
                    "answer": "A low collateralization rate increases unsecured risk for the bank, making expansion loans more vulnerable to default losses and signaling the need for stricter risk controls in this segment."
                }
            ],
            "insight_anomaly_data_points": [
                {
                    "purpose_of_the_loan": "Refinancing Existing Debt",
                    "total_collateral_value": 74782598.6,
                    "total_outstanding_loan_amount": 77286341.4,
                    "Collateralization_Rate": "0.968 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "N",
                    "data_point_title": "Refinancing Existing Debt"
                },
                {
                    "purpose_of_the_loan": "Equipment Purchase",
                    "total_collateral_value": 82934582.8,
                    "total_outstanding_loan_amount": 88888784.05,
                    "Collateralization_Rate": "0.933 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "N",
                    "data_point_title": "Equipment Purchase"
                },
                {
                    "purpose_of_the_loan": "Working Capital",
                    "total_collateral_value": 19070478.55,
                    "total_outstanding_loan_amount": 22132972.65,
                    "Collateralization_Rate": "0.862 x 10⁰",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "N",
                    "data_point_title": "Working Capital"
                },
                {
                    "purpose_of_the_loan": "Expansion",
                    "total_collateral_value": 31313070.65,
                    "total_outstanding_loan_amount": 86525594.5,
                    "Collateralization_Rate": "0.362 x 10⁰",
                    "anomaly_type": "negative",
                    "data_point_idx": 5,
                    "anomaly_details_status": "N",
                    "data_point_title": "Expansion"
                }
            ],
            "insight_id": 766,
            "insight_title": "Expansion Loans Show Lowest Collateral Coverage in Portfolio",
            "insight_brief": "Among Ashley Brown’s clients this year, expansion loans have the weakest collateralization rate (0.36), while refinancing and acquisition loans remain well-secured near full coverage.",
            "insight_summary": "Collateral backing varies significantly across loan purposes for Ashley Brown’s portfolio. Refinancing existing debt and acquisition loans stand out with high collateralization rates (0.97 and 0.79), reflecting strong risk mitigation due to nearly full collateral coverage. Equipment purchase and working capital loans are also securely positioned, averaging rates above 0.86. Expansion loans, however, present a notable gap, with only about a third of their value covered—raising exposure to unsecured risk in this segment. This highlights a potential need for closer review and stricter collateral requirements when approving expansion-related facilities.",
            "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Refinance\",\n      \"Equipmnt\",\n      \"WorkCap\",\n      \"Acqsn\",\n      \"Expand\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateralization Rate\",\n        \"data\": [0.967604, 0.933015, 0.861632, 0.78601, 0.361893],\n        \"backgroundColor\": [\n          \"#1769aa\",\n          \"#26a69a\",\n          \"#9ccc65\",\n          \"#ffd54f\",\n          \"#e57373\"\n        ],\n        \"borderColor\": [\n          \"#104578\",\n          \"#158a74\",\n          \"#6ba036\",\n          \"#c9a832\",\n          \"#b23a35\"\n        ],\n        \"borderWidth\": 1\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Collateralization Rate by Loan Purpose\"\n      },\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { var val = context.parsed.y !== undefined ? context.parsed.y : context.parsed; return 'Collateralization Rate: ' + (val * 100).toFixed(2) + '%'; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Purpose\"\n        },\n        \"ticks\": {\n          \"maxRotation\": 0,\n          \"minRotation\": 0,\n          \"autoSkip\": false,\n          \"font\": {\n            \"size\": 12\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateralization Rate\"\n        },\n        \"min\": 0.3,\n        \"max\": 1,\n        \"ticks\": {\n          \"callback\": \"function(value) { return (value * 100).toFixed(0) + '%'; }\",\n          \"stepSize\": 0.1\n        }\n      }\n    }\n  }\n}",
            "confidence_score": 93,
            "explainability_summary": "[\"<ol><li>The high-level question examined which loan purpose segments within Ashley Brown\\u2019s portfolio showed the greatest security or risk over the past year.</li><li>This objective was further focused to assess how portfolio collateralization rates differ across key loan purposes managed by Ashley Brown.</li><li>The analysis centered on the KPI \\u2018Portfolio Collateralization Rate\\u2019 due to its relevance for understanding secured lending in this context.</li><li>Relevant facility and client data for Ashley Brown was retrieved, segmented by loan purpose, for the defined annual period.</li><li>The resulting dataset provided totals for collateral value and outstanding loan amount across each loan purpose segment.</li><li>Collateralization rates were then calculated to identify which loan purposes offered the strongest and weakest security within the portfolio.</li><li>The insight highlights where lending is most and least protected, supporting decisions on risk management and portfolio development for the Sales Relationship Manager.</li></ol>\"]",
            "sql_query": "{\"sql_query\": \"WITH FacilityCollateralization AS ( SELECT fd.purpose_of_the_loan, SUM(fd.total_collateral_amount_cre + fd.total_collateral_amount_rre + fd.total_collateral_amount_efc + fd.total_collateral_amount_others) AS total_collateral_value, SUM(fd.loan_amount) AS total_outstanding_loan_amount FROM BFS.facility_data fd INNER JOIN BFS.client_data cd ON fd.client_id = cd.client_id INNER JOIN BFS.meeting_data md ON fd.client_id = md.client_id WHERE cd.rm_name = 'Ashley Brown' AND md.meeting_date >= '2024-11-01' AND md.meeting_date < '2025-11-01' GROUP BY fd.purpose_of_the_loan ) SELECT purpose_of_the_loan, total_collateral_value, total_outstanding_loan_amount, CASE WHEN total_outstanding_loan_amount = 0 THEN NULL ELSE total_collateral_value * 1.0 / total_outstanding_loan_amount END AS Collateralization_Rate FROM FacilityCollateralization ORDER BY Collateralization_Rate DESC;\", \"metric_col\": \"Collateralization_Rate\"}",
            "insight_visual_link": null,
            "created_at": null,
            "updated_at": "2025-10-05T05:52:15.227Z",
            "query_result": [
                {
                    "purpose_of_the_loan": "Refinancing Existing Debt",
                    "total_collateral_value": 74782598.6,
                    "total_outstanding_loan_amount": 77286341.4,
                    "Collateralization_Rate": 0.967604
                },
                {
                    "purpose_of_the_loan": "Equipment Purchase",
                    "total_collateral_value": 82934582.8,
                    "total_outstanding_loan_amount": 88888784.05,
                    "Collateralization_Rate": 0.933015
                },
                {
                    "purpose_of_the_loan": "Working Capital",
                    "total_collateral_value": 19070478.55,
                    "total_outstanding_loan_amount": 22132972.65,
                    "Collateralization_Rate": 0.861632
                },
                {
                    "purpose_of_the_loan": "Acquisition",
                    "total_collateral_value": 110561018.28,
                    "total_outstanding_loan_amount": 140660974.51,
                    "Collateralization_Rate": 0.78601
                },
                {
                    "purpose_of_the_loan": "Expansion",
                    "total_collateral_value": 31313070.65,
                    "total_outstanding_loan_amount": 86525594.5,
                    "Collateralization_Rate": 0.361893
                }
            ],
            "query_execution_time": null,
            "query_loading": false,
            "query_error": null,
            "has_query": true
        },
         {
            clientId: 1,
            "insight_faqs": [
                {
                    "question": "Why is Client C-03432 experiencing much longer average delays between meetings compared to other clients?",
                    "answer": "Client C-03432 shows an average delay of 130 days versus less than three weeks for other clients, likely due to missed follow-ups or bottlenecks in progressing actions; reviewing pending tasks and internal dependencies could help address the issue."
                },
                {
                    "question": "How do the meeting intervals for C-03432 compare to those for other clients, and what does this mean for our sales cycle?",
                    "answer": "While C-03432 faces delays up to 344 days between meetings, other clients average only 15–20 days, indicating that the sales progression for C-03432 is at higher risk and requires prioritized attention to avoid lost opportunities."
                },
                {
                    "question": "What steps can I take to reduce the average days elapsed between meetings for C-03432?",
                    "answer": "You should proactively reach out to C-03432, resolve any outstanding or in-progress action items, and coordinate internally to quickly schedule follow-ups and accelerate the sales cycle."
                },
                {
                    "question": "What business risks arise from having such long gaps between meetings with C-03432?",
                    "answer": "Extended intervals may signal declining client engagement, increased risk of deal stagnation or loss, and missed cross-sell opportunities, making it vital to improve responsiveness and meeting cadence."
                }
            ],
            "insight_anomaly_data_points": [
                {
                    "client_id": "C-03432",
                    "Avg_Days_Elapsed": "13 x 10¹",
                    "Max_Days_Elapsed": 344,
                    "anomaly_type": "positive",
                    "data_point_idx": 1,
                    "anomaly_details_status": "N",
                    "data_point_title": "C-03432"
                },
                {
                    "client_id": "C-06446",
                    "Avg_Days_Elapsed": "20",
                    "Max_Days_Elapsed": 20,
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "N",
                    "data_point_title": "C-06446"
                },
                {
                    "client_id": "C-07097",
                    "Avg_Days_Elapsed": "15",
                    "Max_Days_Elapsed": 16,
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "N",
                    "data_point_title": "C-07097"
                },
                {
                    "client_id": "C-09181",
                    "Avg_Days_Elapsed": "-46",
                    "Max_Days_Elapsed": -46,
                    "anomaly_type": "negative",
                    "data_point_idx": 4,
                    "anomaly_details_status": "N",
                    "data_point_title": "C-09181"
                }
            ],
            "insight_id": 763,
            "insight_title": "Long Meeting Delays Flagged for Client C-03432",
            "insight_brief": "Client C-03432 faces significantly longer gaps between meetings than peers, indicating stalled sales cycle progression, while other clients maintain timely follow-ups.",
            "insight_summary": "Client C-03432 averages a 130-day delay between meetings, with an extreme maximum gap of 344 days—far exceeding intervals seen for other clients, which remain below three weeks on average. This prolonged interval may signal potential engagement risks or bottlenecks in advancing sales actions. Most other clients display much shorter, consistent intervals, reflecting effective follow-up processes. Additionally, negative elapsed days with client C-09181 suggest scheduling inconsistencies that need attention. Prioritizing C-03432 and resolving data issues for C-09181 could help improve overall client management efficiency.",
            "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"C-03432\", \"C-06446\", \"C-07097\", \"C-09181\"],\n    \"datasets\": [\n      {\n        \"label\": \"Avg Days Elapsed\",\n        \"data\": [130, 20, 15, -46],\n        \"backgroundColor\": [\n          \"#FFB300\",\n          \"#29B6F6\",\n          \"#66BB6A\",\n          \"#BDBDBD\"\n        ],\n        \"borderRadius\": 6,\n        \"maxBarThickness\": 36\n      }\n    ]\n  },\n  \"options\": {\n    \"plugins\": {\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Average Days Elapsed Between Meetings (per Client)\",\n        \"font\": {\n          \"size\": 18,\n          \"weight\": \"bold\"\n        },\n        \"padding\": {\n          \"bottom\": 12\n        }\n      },\n      \"legend\": {\n        \"display\": false\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) { return 'Client ' + context.label + ': ' + context.parsed.y + ' days'; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Client ID\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"ticks\": {\n          \"font\": {\n            \"size\": 12,\n            \"family\": \"Arial\"\n          },\n          \"maxRotation\": 0,\n          \"minRotation\": 0\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Avg Days Elapsed\",\n          \"font\": {\n            \"size\": 14\n          }\n        },\n        \"beginAtZero\": false,\n        \"min\": -50,\n        \"max\": 150,\n        \"grid\": {\n          \"display\": true,\n          \"drawBorder\": true,\n          \"color\": \"#eeeeee\"\n        },\n        \"ticks\": {\n          \"stepSize\": 50,\n          \"font\": {\n            \"size\": 12,\n            \"family\": \"Arial\"\n          }\n        }\n      }\n    },\n    \"layout\": {\n      \"padding\": {\n        \"top\": 20,\n        \"bottom\": 10,\n        \"left\": 6,\n        \"right\": 6\n      }\n    },\n    \"responsive\": true,\n    \"maintainAspectRatio\": false\n  }\n}",
            "confidence_score": 92,
            "explainability_summary": "[\"<ol><li>The strategic objective was to evaluate delays affecting the sales cycle progression for clients managed by Ashley Brown.</li><li>A focused question was formed to measure average and maximum days elapsed between meetings for each client from November 2024 to October 2025 where action items remain incomplete or in progress.</li><li>The KPI \\u2018Days to Next Meeting\\u2019 was prioritized, given its direct relevance to tracking follow-up intervals and potential sales cycle lags for the Sales Relationship Manager role.</li><li>Relevant data was extracted by analyzing meeting dates and next meeting dates for Ashley Brown\\u2019s clients with action items pending or underway.</li><li>The dataset was structured to report average and peak intervals between meetings per client, highlighting performance gaps.</li><li>The results showed that client C-03432 experienced significantly longer average delays (130 days) and the highest peak lag (344 days), while other clients had much shorter intervals; C-09181 indicated possible data inconsistencies due to negative elapsed days.</li><li>This insight enables the Sales Relationship Manager to identify cases with prolonged delays, ensuring targeted follow-ups and improved client engagement strategies.</li></ol>\"]",
            "sql_query": "{\"sql_query\": \"SELECT md.client_id, AVG(DATEDIFF(day, md.meeting_date, md.next_meeting_date)) AS Avg_Days_Elapsed, MAX(DATEDIFF(day, md.meeting_date, md.next_meeting_date)) AS Max_Days_Elapsed FROM BFS.meeting_data md JOIN BFS.client_data cd ON md.client_id = cd.client_id WHERE cd.rm_name = 'Ashley Brown' AND md.meeting_date >= '2024-11-01' AND md.meeting_date < '2025-11-01' AND md.Next_Action_Item IS NOT NULL AND md.Action_status IN ('Not Completed', 'In Progress') GROUP BY md.client_id;\", \"metric_col\": \"Avg_Days_Elapsed\"}",
            "insight_visual_link": null,
            "created_at": null,
            "updated_at": "2025-10-05T05:42:29.553Z",
            "query_result": [
                {
                    "client_id": "C-03432",
                    "Avg_Days_Elapsed": 130,
                    "Max_Days_Elapsed": 344
                },
                {
                    "client_id": "C-06446",
                    "Avg_Days_Elapsed": 20,
                    "Max_Days_Elapsed": 20
                },
                {
                    "client_id": "C-07097",
                    "Avg_Days_Elapsed": 15,
                    "Max_Days_Elapsed": 16
                },
                {
                    "client_id": "C-09181",
                    "Avg_Days_Elapsed": -46,
                    "Max_Days_Elapsed": -46
                }
            ],
            "query_execution_time": null,
            "query_loading": false,
            "query_error": null,
            "has_query": true
        },
        {
           clientId: 2,
            "insight_faqs": [
                {
                    "question": "Why are Ericksonview and Virginiachester showing minimal Total Balance Contribution compared to Port Susanfort and Terrifurt?",
                    "answer": "Both regions consist solely of prospect clients with no existing account activity yet, unlike Port Susanfort and Terrifurt, which are dominated by established clients actively contributing to total balances."
                },
                {
                    "question": "What targeted actions can be taken to increase Total Balance Contribution in these underperforming regions?",
                    "answer": "Focused outreach and tailored deposit offerings to prospect clients in Professional Services and Real Estate could convert them into active contributors, driving meaningful portfolio growth."
                },
                {
                    "question": "How do the client types and industries in low balance regions impact business development opportunities?",
                    "answer": "Since all clients are prospects in Consulting and Property Management sectors, these segments represent promising targets for onboarding campaigns and customized relationship-building efforts."
                },
                {
                    "question": "What is the business implication of having regions with zero existing clients and low balances in Ashley Brown’s portfolio?",
                    "answer": "This indicates untapped market potential where strategic engagement could unlock new revenue streams and strengthen portfolio financial stability for the Sales Relationship Manager."
                }
            ],
            "insight_anomaly_data_points": [
                {
                    "Location": "Ericksonview",
                    "Total_Balance_Contribution": "0",
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC",
                    "Client_Industry_Summary": "2211, 2211",
                    "Client_Type_Summary": "Prospect, Prospect",
                    "anomaly_type": "normal",
                    "data_point_idx": 1,
                    "anomaly_details_status": "N",
                    "data_point_title": "Ericksonview"
                },
                {
                    "Location": "Virginiachester",
                    "Total_Balance_Contribution": "0",
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC",
                    "Client_Industry_Summary": "1111",
                    "Client_Type_Summary": "Prospect",
                    "anomaly_type": "normal",
                    "data_point_idx": 2,
                    "anomaly_details_status": "N",
                    "data_point_title": "Virginiachester"
                },
                {
                    "Location": "Port Susanfort",
                    "Total_Balance_Contribution": "90.791 x 10⁴",
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC, LC",
                    "Client_Industry_Summary": "6211, 6211, 6211, 6211, 6211",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing, Existing",
                    "anomaly_type": "normal",
                    "data_point_idx": 3,
                    "anomaly_details_status": "N",
                    "data_point_title": "Port Susanfort"
                },
                {
                    "Location": "Terrifurt",
                    "Total_Balance_Contribution": "17.55x 10⁵",
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC",
                    "Client_Industry_Summary": "5418, 5418, 5418, 5418",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing",
                    "anomaly_type": "positive",
                    "data_point_idx": 4,
                    "anomaly_details_status": "N",
                    "data_point_title": "Terrifurt"
                }
            ],
            "insight_id": 752,
            "insight_title": "Ericksonview and Virginiachester Register Minimal Client Balances",
            "insight_brief": "Two regions, Ericksonview and Virginiachester, have virtually no total balance contributions from Ashley Brown’s client base over the past year. These areas consist solely of prospect clients, highlighting significant potential for new business development.",
            "insight_summary": "Ericksonview and Virginiachester exhibit exceptionally low or zero total balances among Ashley Brown’s clients from November 2024 to October 2025, contrasting with the stronger portfolio engagement seen in Port Susanfort and Terrifurt. Prospective clients in the underperforming regions are primarily involved in Professional Services and Real Estate, with industries such as Consulting and Property Management. Absence of existing clients points to scarce current activity but also suggests that targeted outreach and tailored offerings could position these areas for meaningful portfolio growth and market expansion.",
            "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Ericksonview\",\n      \"Virginiachester\",\n      \"Port Susanfort\",\n      \"Terrifurt\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Total Balance Contribution\",\n        \"data\": [\n          0.0,\n          0.0,\n          907906.9,\n          1754960.92\n        ],\n        \"backgroundColor\": [\n          \"#C5C5C5\",\n          \"#B8D8F2\",\n          \"#7FB3D5\",\n          \"#2471A3\"\n        ],\n        \"borderColor\": \"#1B4F72\",\n        \"borderWidth\": 1\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Total Balance Contribution by Location\",\n        \"font\": {\n          \"size\": 18,\n          \"weight\": \"bold\"\n        }\n      },\n      \"tooltip\": {\n        \"enabled\": true,\n        \"callbacks\": {\n          \"label\": \"function(context) {var value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;x return 'Total Balance: $' + value.toLocaleString(undefined, {minimumFractionDigits: 2});}\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Location\"\n        },\n        \"ticks\": {\n          \"maxRotation\": 0,\n          \"minRotation\": 0,\n          \"padding\": 8,\n          \"font\": {\n            \"size\": 12\n          }\n        },\n        \"grid\": {\n          \"display\": false\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Total Balance ($)\"\n        },\n        \"beginAtZero\": true,\n        \"min\": 0,\n        \"max\": 2000000,\n        \"ticks\": {\n          \"stepSize\": 500000,\n          \"font\": {\n            \"size\": 12\n          },\n          \"callback\": \"function(value) { return '$' + value.toLocaleString(); }\"\n        },\n        \"grid\": {\n          \"color\": \"#EFEFEF\",\n          \"drawBorder\": true\n        }\n      }\n    }\n  }\n}",
            "confidence_score": 92,
            "explainability_summary": "[\"<ol><li>A strategic question was defined to identify geographic regions contributing most to total client balances and growth opportunities for the Sales Relationship Manager.</li><li>This question was narrowed to highlight regions with low or zero total balance contributions, including their client characteristics.</li><li>The KPI \\u2018Total Balance\\u2019 was selected based on its relevance for evaluating portfolio financial stability and liquidity, aligning with the persona\\u2019s goals.</li><li>A targeted analysis retrieved client data segmented by location and aggregated total balance, business classification, industry, and client type, from November 2024 to October 2025.</li><li>The resulting dataset revealed that Ericksonview and Virginiachester have minimal or no total balance contributions and consist exclusively of Prospect clients in Professional Services and Real Estate.</li><li>This finding indicates untapped opportunities for expansion and targeted portfolio development in these regions for the Sales Relationship Manager.</li><li>The insight enables prioritization of business development efforts toward locations with low engagement and high potential.</li></ol>\"]",
            "sql_query": "{\"sql_query\": \"WITH Filtered_Clients AS (\\n    SELECT \\n        cd.client_id, \\n        cd.location, \\n        cd.business_classification, \\n        cd.client_industry, \\n        cd.client_type, \\n        cd.total_balance \\n    FROM BFS.client_data cd \\n    INNER JOIN BFS.meeting_data md ON cd.client_id = md.client_id \\n    WHERE cd.rm_name = 'Ashley Brown' \\n      AND md.meeting_date >= '2024-11-01' AND md.meeting_date < '2025-11-01'\\n)\\nSELECT \\n    fc.location AS Location,\\n    SUM(ISNULL(fc.total_balance, 0)) AS Total_Balance_Contribution,\\n    CASE WHEN SUM(ISNULL(fc.total_balance, 0)) <= 1000 THEN 1 ELSE 0 END AS Is_Low_or_Zero_Balance,\\n    COUNT(DISTINCT fc.client_id) AS Num_Clients,\\n    STRING_AGG(fc.business_classification, ', ') AS Business_Classification_Summary,\\n    STRING_AGG(fc.client_industry, ', ') AS Client_Industry_Summary,\\n    STRING_AGG(fc.client_type, ', ') AS Client_Type_Summary\\nFROM Filtered_Clients fc\\nGROUP BY fc.location\\nORDER BY Total_Balance_Contribution ASC, Location;\", \"metric_col\": \"Total_Balance_Contribution\"}",
            "insight_visual_link": null,
            "created_at": null,
            "updated_at": "2025-10-05T05:28:02.580Z",
            "query_result": [
                {
                    "Location": "Ericksonview",
                    "Total_Balance_Contribution": 0,
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC",
                    "Client_Industry_Summary": "2211, 2211",
                    "Client_Type_Summary": "Prospect, Prospect"
                },
                {
                    "Location": "Virginiachester",
                    "Total_Balance_Contribution": 0,
                    "Is_Low_or_Zero_Balance": 1,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC",
                    "Client_Industry_Summary": "1111",
                    "Client_Type_Summary": "Prospect"
                },
                {
                    "Location": "Port Susanfort",
                    "Total_Balance_Contribution": 907906.9,
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC, LC",
                    "Client_Industry_Summary": "6211, 6211, 6211, 6211, 6211",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing, Existing"
                },
                {
                    "Location": "Terrifurt",
                    "Total_Balance_Contribution": 1754960.92,
                    "Is_Low_or_Zero_Balance": 0,
                    "Num_Clients": 1,
                    "Business_Classification_Summary": "LC, LC, LC, LC",
                    "Client_Industry_Summary": "5418, 5418, 5418, 5418",
                    "Client_Type_Summary": "Existing, Existing, Existing, Existing"
                }
            ],
            "query_execution_time": null,
            "query_loading": false,
            "query_error": null,
            "has_query": true
        },
        {
           clientId: 2,
            "insight_faqs": [
                {
                    "question": "Why does residential real estate contribute a much higher percentage to collateral value in Ashley Brown's loan portfolio compared to other categories?",
                    "answer": "Residential real estate is typically more prevalent and valued among clients, making it a preferred form of security and resulting in its dominant share across most loan types within this portfolio."
                },
                {
                    "question": "How does the collateral contribution of equipment and machinery or commercial real estate compare to residential real estate in these loans?",
                    "answer": "Equipment and machinery provide significant collateral value for some products, but consistently trail residential real estate, while commercial real estate plays a minor role, contributing 15% or less across all loan types."
                },
                {
                    "question": "What steps can I take as a Relationship Manager to further improve the collateralization rate in my portfolio?",
                    "answer": "You can encourage clients to pledge higher-valued or additional residential properties, regularly update collateral valuations, and selectively target deals where alternative asset types bolster overall loan security."
                },
                {
                    "question": "What are the business implications of relying mainly on residential real estate for loan collateral?",
                    "answer": "Heavy reliance on residential assets secures the loan portfolio, but may concentrate risk in a single asset class; diversifying collateral sources can enhance risk management and support long-term growth."
                }
            ],
            "insight_anomaly_data_points": [
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 37720695.8,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": "54.816",
                    "anomaly_type": "positive",
                    "data_point_idx": 5,
                    "anomaly_details_status": "N",
                    "data_point_title": "Letter of Credit - Residential Real Estate"
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Other Assets",
                    "collateral_value": 12364937.7,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": "17.969",
                    "anomaly_type": "normal",
                    "data_point_idx": 7,
                    "anomaly_details_status": "N",
                    "data_point_title": "Letter of Credit - Other Assets"
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 12165742.2,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": "47.539",
                    "anomaly_type": "positive",
                    "data_point_idx": 9,
                    "anomaly_details_status": "N",
                    "data_point_title": "Overdraft - Residential Real Estate"
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 2419613.35,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": "9.455",
                    "anomaly_type": "normal",
                    "data_point_idx": 11,
                    "anomaly_details_status": "N",
                    "data_point_title": "Overdraft - Equipment and Machinery"
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 48333151.24,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": "64.632",
                    "anomaly_type": "positive",
                    "data_point_idx": 13,
                    "anomaly_details_status": "N",
                    "data_point_title": "Revolving Line of Credit - Residential Real Estate"
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 20633578.64,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": "27.591",
                    "anomaly_type": "normal",
                    "data_point_idx": 14,
                    "anomaly_details_status": "N",
                    "data_point_title": "Revolving Line of Credit - Equipment and Machinery"
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Commercial Real Estate",
                    "collateral_value": 241771.16,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": "0.323 x 10⁰",
                    "anomaly_type": "negative",
                    "data_point_idx": 16,
                    "anomaly_details_status": "N",
                    "data_point_title": "Revolving Line of Credit - Commercial Real Estate"
                }
            ],
            "insight_id": 755,
            "insight_title": "Residential Real Estate Dominates Collateral Mix in Loans (Nov 2024–Oct 2025)",
            "insight_brief": "Residential real estate provides the highest share of collateral value across most loan types in Ashley Brown’s portfolio, notably exceeding 47% in overdraft, 55% in letters of credit, and 65% in revolving credit facilities.",
            "insight_summary": "Ashley Brown’s managed loans show a clear trend: residential real estate is the leading collateral category for several key products—representing nearly two-thirds of total collateral in revolving credit lines, over half in letters of credit, and close to half in overdraft facilities. In contrast, bank guarantees rely most on 'Other Assets' (43%), followed by equipment and machinery (24%). Commercial real estate consistently has the lowest proportional impact, contributing 15% or less across all loan types. This collateral composition suggests the portfolio’s risk profile and coverage are primarily secured by residential assets, with targeted diversification in other collateral types for specific products. To optimize portfolio collateralization, focusing on further strengthening residential real estate backing—or enhancing equipment and other asset values where they dominate—may improve overall security and support strategic growth.",
            "data_points": "{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\n      \"Bank Guarantees:Other Assets\",\n      \"Bank Guarantees:Equip & Mach.\",\n      \"Bank Guarantees:Resi. RE\",\n      \"Bank Guarantees:Comm. RE\",\n      \"Letter of Credit:Resi. RE\",\n      \"Letter of Credit:Equip & Mach.\",\n      \"Letter of Credit:Other Assets\",\n      \"Letter of Credit:Comm. RE\",\n      \"Overdraft:Resi. RE\",\n      \"Overdraft:Other Assets\",\n      \"Overdraft:Equip & Mach.\",\n      \"Overdraft:Comm. RE\",\n      \"Revol. Line:Resi. RE\",\n      \"Revol. Line:Equip & Mach.\",\n      \"Revol. Line:Other Assets\",\n      \"Revol. Line:Comm. RE\"\n    ],\n    \"datasets\": [\n      {\n        \"label\": \"Collateral Contribution (%)\",\n        \"data\": [\n          43.030715,\n          23.69766,\n          17.956908,\n          15.314714,\n          54.815853,\n          23.11668,\n          17.968772,\n          4.098692,\n          47.538841,\n          36.534084,\n          9.454878,\n          6.472195,\n          64.631548,\n          27.591417,\n          7.453736,\n          0.323298\n        ],\n        \"backgroundColor\": [\n          \"#2E86AB\",\n          \"#3498DB\",\n          \"#207561\",\n          \"#FFB400\",\n          \"#487EB0\",\n          \"#008585\",\n          \"#B0B9B3\",\n          \"#F28585\",\n          \"#2E86AB\",\n          \"#B0B9B3\",\n          \"#008585\",\n          \"#FFB400\",\n          \"#207561\",\n          \"#008585\",\n          \"#B0B9B3\",\n          \"#F28585\"\n        ],\n        \"borderColor\": \"#665142\",\n        \"borderWidth\": 1\n      }\n    ]\n  },\n  \"options\": {\n    \"responsive\": true,\n    \"plugins\": {\n      \"legend\": {\n        \"display\": false\n      },\n      \"title\": {\n        \"display\": true,\n        \"text\": \"Collateral Contribution % by Facility and Collateral Type\"\n      },\n      \"tooltip\": {\n        \"callbacks\": {\n          \"label\": \"function(context) { return context.label + ': ' + context.parsed.y.toFixed(2) + '%'; }\"\n        }\n      }\n    },\n    \"scales\": {\n      \"x\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Facility : Collateral Type\"\n        },\n        \"ticks\": {\n          \"maxRotation\": 0,\n          \"minRotation\": 0,\n          \"autoSkip\": false,\n          \"font\": {\n            \"size\": 11\n          }\n        }\n      },\n      \"y\": {\n        \"title\": {\n          \"display\": true,\n          \"text\": \"Collateral Contribution (%)\"\n        },\n        \"min\": 0,\n        \"max\": 70,\n        \"ticks\": {\n          \"stepSize\": 10,\n          \"font\": {\n            \"size\": 12\n          },\n          \"callback\": \"function(value, index, values) { return value + '%'; }\"\n        }\n      }\n    }\n  }\n}",
            "confidence_score": 92,
            "explainability_summary": "[\"<ol><li>A high-level business question was developed to determine overall collateralization for loans managed by Ashley Brown and identify loan types or collateral categories driving security.</li><li>This was narrowed to analyzing the proportional contribution of each collateral category, segmented by loan type, for Ashley Brown\\u2019s portfolio during November 2024 to October 2025.</li><li>The analysis focused on the KPI \\u2018Portfolio Collateralization Rate\\u2019 due to its relevance to loan security and the sales relationship manager\\u2019s responsibilities.</li><li>A targeted data retrieval was conducted to extract collateral amount details across all active loan types and collateral categories managed by Ashley Brown during the specified period.</li><li>The dataset was organized to show the percentage contribution of commercial real estate, residential real estate, equipment and machinery, and other assets to the total collateral value within each loan type.</li><li>The data revealed that residential real estate was the strongest contributor to collateral value overall, with notable secondary roles from other assets and equipment, and a smaller impact from commercial real estate.</li><li>This insight enables the sales relationship manager to recognize which collateral categories most influence portfolio security, guiding strategy for client engagement and risk assessment.</li></ol>\"]",
            "sql_query": "{\"sql_query\": \"WITH FilteredLoans AS ( SELECT fd.facility_id, fd.client_id, fd.type_of_facility, fd.total_collateral_amount_cre, fd.total_collateral_amount_rre, fd.total_collateral_amount_efc, fd.total_collateral_amount_others FROM BFS.facility_data fd INNER JOIN BFS.client_data cd ON fd.client_id = cd.client_id WHERE cd.rm_name = 'Ashley Brown' ), EligibleFacilities AS ( SELECT fl.*, md.meeting_date FROM FilteredLoans fl INNER JOIN BFS.meeting_data md ON fl.client_id = md.client_id WHERE md.meeting_date >= '2024-11-01' AND md.meeting_date <= '2025-10-31' ), CollateralSummary AS ( SELECT ef.type_of_facility, 'Commercial Real Estate' AS collateral_type, SUM(ef.total_collateral_amount_cre) AS collateral_value FROM EligibleFacilities ef GROUP BY ef.type_of_facility UNION ALL SELECT ef.type_of_facility, 'Residential Real Estate' AS collateral_type, SUM(ef.total_collateral_amount_rre) AS collateral_value FROM EligibleFacilities ef GROUP BY ef.type_of_facility UNION ALL SELECT ef.type_of_facility, 'Equipment and Machinery' AS collateral_type, SUM(ef.total_collateral_amount_efc) AS collateral_value FROM EligibleFacilities ef GROUP BY ef.type_of_facility UNION ALL SELECT ef.type_of_facility, 'Other Assets' AS collateral_type, SUM(ef.total_collateral_amount_others) AS collateral_value FROM EligibleFacilities ef GROUP BY ef.type_of_facility ), CollateralTotal AS ( SELECT type_of_facility, SUM(collateral_value) AS total_collateral_value FROM CollateralSummary GROUP BY type_of_facility ) SELECT cs.type_of_facility, cs.collateral_type, cs.collateral_value, ct.total_collateral_value, (cs.collateral_value * 100.0) / NULLIF(ct.total_collateral_value, 0) AS collateral_contribution_pct FROM CollateralSummary cs INNER JOIN CollateralTotal ct ON cs.type_of_facility = ct.type_of_facility ORDER BY cs.type_of_facility, collateral_contribution_pct DESC;\", \"metric_col\": \"collateral_contribution_pct\"}",
            "insight_visual_link": null,
            "created_at": null,
            "updated_at": "2025-10-05T05:31:27.270Z",
            "query_result": [
                {
                    "type_of_facility": "Bank Guarantees",
                    "collateral_type": "Other Assets",
                    "collateral_value": 64319951.34,
                    "total_collateral_value": 149474508.93,
                    "collateral_contribution_pct": 43.030715
                },
                {
                    "type_of_facility": "Bank Guarantees",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 35421962.16,
                    "total_collateral_value": 149474508.93,
                    "collateral_contribution_pct": 23.69766
                },
                {
                    "type_of_facility": "Bank Guarantees",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 26841000.8,
                    "total_collateral_value": 149474508.93,
                    "collateral_contribution_pct": 17.956908
                },
                {
                    "type_of_facility": "Bank Guarantees",
                    "collateral_type": "Commercial Real Estate",
                    "collateral_value": 22891594.63,
                    "total_collateral_value": 149474508.93,
                    "collateral_contribution_pct": 15.314714
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 37720695.8,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": 54.815853
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 15907392.3,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": 23.11668
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Other Assets",
                    "collateral_value": 12364937.7,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": 17.968772
                },
                {
                    "type_of_facility": "Letter of Credit",
                    "collateral_type": "Commercial Real Estate",
                    "collateral_value": 2820452.8,
                    "total_collateral_value": 68813478.6,
                    "collateral_contribution_pct": 4.098692
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 12165742.2,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": 47.538841
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Other Assets",
                    "collateral_value": 9349497.05,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": 36.534084
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 2419613.35,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": 9.454878
                },
                {
                    "type_of_facility": "Overdraft",
                    "collateral_type": "Commercial Real Estate",
                    "collateral_value": 1656310.15,
                    "total_collateral_value": 25591162.75,
                    "collateral_contribution_pct": 6.472195
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Residential Real Estate",
                    "collateral_value": 48333151.24,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": 64.631548
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Equipment and Machinery",
                    "collateral_value": 20633578.64,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": 27.591417
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Other Assets",
                    "collateral_value": 5574097.56,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": 7.453736
                },
                {
                    "type_of_facility": "Revolving Line of Credit",
                    "collateral_type": "Commercial Real Estate",
                    "collateral_value": 241771.16,
                    "total_collateral_value": 74782598.6,
                    "collateral_contribution_pct": 0.323298
                }
            ],
            "query_execution_time": null,
            "query_loading": false,
            "query_error": null,
            "has_query": true
        },
    ],
  reportsData: null,
  loading: {
    home: true,
    insights: true,
  },
  error: null,
  chartFilters: {},
  dashboardCount: {
    insight: 0,
    reports: 0,
    artifacts: 0,
  },
  lastRefreshed: {
    home: null,
    insight: null,
  },
  queryResults: {},
  queryExecutionStates: {
    batchExecuting: false,
    totalQueries: 0,
    completedQueries: 0,
    failedQueries: 0,
  },
  dashboardReadiness: {
    home: false,
    insights: false,
  },
  KpiDashboardData: {
    kpis: [
      { clientId: 1, title: 'Deposit Balance', value: '$10M', sub: '(+3.2% of LY Avg)', trend: 'up' },
      { clientId: 1, title: 'Loan Outstanding', value: '$1.2M', sub: '(Out of $10M)' },
      { clientId: 1, title: 'Credit Utilisation', value: '60%', sub: '(Out of $22M)' },
      { clientId: 1, title: 'Net Profit', value: '$2.4M', sub: '(+5% YoY)', trend: 'up' },
      { clientId: 2, title: 'Credit Utilisation', value: '60%', sub: '(Out of $22M)' },
      { clientId: 2, title: 'Net Profit', value: '$2.4M', sub: '(+5% YoY)', trend: 'up' },
    ],
    score: [
      {
        clientId: 1,
        title: 'Financial Score',
        value: '8.1/10',
        sub: '(+0.5 of MoM)',
        badge: 'Good',
        badgeColor: 'yellow',
        trend: 'up',
      },
      {
        clientId: 1,
        title: 'Relationship Score',
        value: '8.6/10',
        sub: '(+1.5% MoM)',
        badge: 'Great',
        badgeColor: 'green',
        trend: 'up',
      },
      {
        clientId: 1,
        title: 'Risk and Stability Score',
        value: '7.2/10',
        sub: '(-0.5% MoM)',
        badge: 'Low Risk',
        badgeColor: 'lightGreen',
        trend: 'down',
      },
      {
        clientId: 2,
        title: 'Risk and Stability Score',
        value: '7.2/10',
        sub: '(-0.5% MoM)',
        badge: 'Low Risk',
        badgeColor: 'lightGreen',
        trend: 'down',
      },
    ],
  },
  depositLoanDetails: {
    MoM: [
      {
        clientId: 1,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.65, 0.6, 0.62, 0.7, 0.78, 0.88, 0.98, 1.02, 1.05, 1.1, 0.9, 0.6],
      },
      {
        clientId: 2,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.6, 0.61, 0.4, 0.8, 0.12, 0.44, 0.45, 1.08, 1.98, 1.2, 0.2, 0.7],
      },
    ],
    YoY: [
      {
        clientId: 1,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [3.0, 6.0, 13.8, 10.5, 4.8],
      },
      {
        clientId: 2,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [4.0, 7.0, 10.8, 10.5, 2.8],
      },
    ],
    QoQ: [
      {
        clientId: 1,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.7, 0.9, 1.0, 0.6],
      },
      {
        clientId: 2,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.3, 0.9, 1.0, 0.8],
      },
    ],
  },
  loanOutstandingDetails: {
    MoM: [
      {
        clientId: 1,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.45, 0.55, 0.8, 0.8, 0.6, 0.5, 0.7, 0.9, 0.75, 1.0, 0.85, 0.65],
      },
      {
        clientId: 2,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.4, 0.9, 0.2, 0.1, 0.6, 0.9, 0.3, 0.9, 0.75, 2.0, 0.85, 0.5],
      },
    ],
    YoY: [
      {
        clientId: 1,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [2.2, 3.1, 4.0, 3.4, 2.8],
      },
      {
        clientId: 2,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [4.0, 1.1, 4.0, 3.4, 2.8],
      },
    ],
    QoQ: [
      {
        clientId: 1,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.5, 0.9, 1.1, 0.7],
      },
      {
        clientId: 2,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.9, 0.9, 0.9, 0.7],
      },
    ],
  },
  revenueGraphDetails: {},
  TotalProfitandLossRelationship: {
    Top1 : {
      YoY: {
        Profit: [
          { year: 2021, product1: 700000, product2: 600000, product3: 500000, clientId: 1 },
          { year: 2022, product1: 800000, product2: 700000, product3: 650000, clientId: 1 },
          { year: 2023, product1: 900000, product2: 850000, product3: 800000, clientId: 1 },
          { year: 2021, product1: 750000, product2: 620000, product3: 480000, clientId: 2 },
          { year: 2022, product1: 830000, product2: 710000, product3: 660000, clientId: 2 },
          { year: 2023, product1: 920000, product2: 860000, product3: 790000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 200000, product2: 180000, product3: 160000, clientId: 1 },
          { year: 2022, product1: 150000, product2: 140000, product3: 130000, clientId: 1 },
          { year: 2023, product1: 100000, product2: 90000, product3: 80000, clientId: 1 },
          { year: 2021, product1: 210000, product2: 170000, product3: 150000, clientId: 2 },
          { year: 2022, product1: 160000, product2: 130000, product3: 120000, clientId: 2 },
          { year: 2023, product1: 110000, product2: 85000, product3: 82000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 90000, product2: 85000, product3: 80000, clientId: 1 },
          { month: 'Feb', product1: 95000, product2: 90000, product3: 88000, clientId: 1 },
          { month: 'Mar', product1: 100000, product2: 95000, product3: 92000, clientId: 1 },
          { month: 'Jan', product1: 88000, product2: 83000, product3: 81000, clientId: 2 },
          { month: 'Feb', product1: 96000, product2: 91000, product3: 87000, clientId: 2 },
          { month: 'Mar', product1: 102000, product2: 97000, product3: 93000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 30000, product2: 28000, product3: 25000, clientId: 1 },
          { month: 'Feb', product1: 25000, product2: 23000, product3: 22000, clientId: 1 },
          { month: 'Mar', product1: 20000, product2: 18000, product3: 17000, clientId: 1 },
          { month: 'Jan', product1: 32000, product2: 29000, product3: 26000, clientId: 2 },
          { month: 'Feb', product1: 26000, product2: 24000, product3: 21000, clientId: 2 },
          { month: 'Mar', product1: 19000, product2: 17000, product3: 16000, clientId: 2 },
        ],
      },
    },
    Top2: {
      YoY: {
        Profit: [
          { year: 2021, product1: 600000, product2: 550000, product3: 450000, clientId: 1 },
          { year: 2022, product1: 700000, product2: 650000, product3: 550000, clientId: 1 },
          { year: 2023, product1: 780000, product2: 720000, product3: 650000, clientId: 1 },
          { year: 2021, product1: 620000, product2: 530000, product3: 440000, clientId: 2 },
          { year: 2022, product1: 710000, product2: 640000, product3: 560000, clientId: 2 },
          { year: 2023, product1: 800000, product2: 740000, product3: 660000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 180000, product2: 160000, product3: 140000, clientId: 1 },
          { year: 2022, product1: 140000, product2: 120000, product3: 110000, clientId: 1 },
          { year: 2023, product1: 100000, product2: 90000, product3: 85000, clientId: 1 },
          { year: 2021, product1: 190000, product2: 150000, product3: 130000, clientId: 2 },
          { year: 2022, product1: 150000, product2: 125000, product3: 105000, clientId: 2 },
          { year: 2023, product1: 95000, product2: 88000, product3: 82000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 80000, product2: 75000, product3: 70000, clientId: 1 },
          { month: 'Feb', product1: 85000, product2: 80000, product3: 76000, clientId: 1 },
          { month: 'Mar', product1: 90000, product2: 85000, product3: 82000, clientId: 1 },
          { month: 'Jan', product1: 78000, product2: 74000, product3: 69000, clientId: 2 },
          { month: 'Feb', product1: 83000, product2: 79000, product3: 75000, clientId: 2 },
          { month: 'Mar', product1: 91000, product2: 86000, product3: 83000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 25000, product2: 23000, product3: 21000, clientId: 1 },
          { month: 'Feb', product1: 22000, product2: 20000, product3: 18000, clientId: 1 },
          { month: 'Mar', product1: 20000, product2: 17000, product3: 16000, clientId: 1 },
          { month: 'Jan', product1: 26000, product2: 24000, product3: 22000, clientId: 2 },
          { month: 'Feb', product1: 21000, product2: 19000, product3: 17000, clientId: 2 },
          { month: 'Mar', product1: 19000, product2: 16000, product3: 15000, clientId: 2 },
        ],
      },
    },
    Top3: {
      YoY: {
        Profit: [
          { year: 2021, product1: 500000, product2: 450000, product3: 400000, clientId: 1 },
          { year: 2022, product1: 580000, product2: 520000, product3: 470000, clientId: 1 },
          { year: 2023, product1: 650000, product2: 600000, product3: 550000, clientId: 1 },
          { year: 2021, product1: 520000, product2: 460000, product3: 380000, clientId: 2 },
          { year: 2022, product1: 600000, product2: 540000, product3: 490000, clientId: 2 },
          { year: 2023, product1: 670000, product2: 610000, product3: 560000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 150000, product2: 140000, product3: 130000, clientId: 1 },
          { year: 2022, product1: 120000, product2: 110000, product3: 100000, clientId: 1 },
          { year: 2023, product1: 90000, product2: 85000, product3: 80000, clientId: 1 },
          { year: 2021, product1: 160000, product2: 145000, product3: 125000, clientId: 2 },
          { year: 2022, product1: 125000, product2: 115000, product3: 95000, clientId: 2 },
          { year: 2023, product1: 88000, product2: 82000, product3: 78000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 70000, product2: 66000, product3: 62000, clientId: 1 },
          { month: 'Feb', product1: 74000, product2: 70000, product3: 66000, clientId: 1 },
          { month: 'Mar', product1: 78000, product2: 74000, product3: 70000, clientId: 1 },
          { month: 'Jan', product1: 68000, product2: 64000, product3: 60000, clientId: 2 },
          { month: 'Feb', product1: 72000, product2: 69000, product3: 65000, clientId: 2 },
          { month: 'Mar', product1: 79000, product2: 75000, product3: 71000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 22000, product2: 21000, product3: 20000, clientId: 1 },
          { month: 'Feb', product1: 20000, product2: 19000, product3: 18000, clientId: 1 },
          { month: 'Mar', product1: 18000, product2: 16000, product3: 15000, clientId: 1 },
          { month: 'Jan', product1: 23000, product2: 21500, product3: 20500, clientId: 2 },
          { month: 'Feb', product1: 19000, product2: 18000, product3: 17000, clientId: 2 },
          { month: 'Mar', product1: 17000, product2: 15500, product3: 14500, clientId: 2 },
        ],
      },
    },
  },
  engagementDetails: {
    engagement: [
      { clientId: 1, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
      { clientId: 2, label: 'Upcoming Meeting Review', date: '01 Jan 2026', status: 'none' },
      { clientId: 1, label: 'Last Maturity Date', date: '22 Sep 2030', status: 'green' },
      { clientId: 1, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
      { clientId: 2, label: 'Upcoming Quarterly Review', date: '01 Feb 2026', status: 'orange' },
      { clientId: 1, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
      { clientId: 2, label: 'Upcoming Annual Review', date: '01 Mar 2026', status: 'green' },
    ],
    accounts: [
      {
        clientId: 1,
        no: '1234567890',
        openingDate: '21/01/2025',
        riskRating: '6.2/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 1',
        balance: '$65,000',
        interestRate: '2.5%',
      },
      {
        clientId: 1,
        no: '9876543210',
        openingDate: '22/10/2024',
        riskRating: '8.1/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 3',
        balance: '$81,000',
        interestRate: '3.1%',
      },
      {
        clientId: 1,
        no: '5647382910',
        openingDate: '14/08/2024',
        riskRating: '7.3/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 4',
        balance: '$95,500',
        interestRate: '2.9%',
      },
      {
        clientId: 1,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
      {
        clientId: 2,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
      {
        clientId: 2,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
    ],
    teams: [
      { clientId: 1, team: 'Name of the Team A', contactName: 'Contact Name A', email: 'a@example.com' },
      { clientId: 2, team: 'Name of the Team d', contactName: 'Contact Name d', email: 'd@example.com' },
      { clientId: 1, team: 'Name of the Team B', contactName: 'Contact Name B', email: 'b@example.com' },
      { clientId: 1, team: 'Name of the Team C', contactName: 'Contact Name C', email: 'c@example.com' },
      { clientId: 2, team: 'Name of the Team d', contactName: 'Contact Name d', email: 'd@example.com' },
    ],
  },
  volumeOfUsageDetails: [
    { clientId: 1, name: 'Product A', value: 12 },
    { clientId: 1, name: 'Product B', value: 20 },
    { clientId: 1, name: 'Product C', value: 28 },
    { clientId: 1, name: 'Product D', value: 16 },
    { clientId: 2, name: 'Product B', value: 26 },
    { clientId: 2, name: 'Product D', value: 20 },
  ],
  revenueAndProfitAtProductLevel: [
  { clientId: 1, name: 'Product 1', revenue: 400000, profit: 24, category: 'one' },
  { clientId: 1, name: 'Product 2', revenue: 300000, profit: 13, category: 'two' },
  { clientId: 1, name: 'Product 3', revenue: 200000, profit: 98, category: 'one' },
  { clientId: 1, name: 'Product 4', revenue: 278000, profit: 39, category: 'two' },
  { clientId: 2, name: 'Product 1', revenue: 278000, profit: 29, category: 'one' },
  { clientId: 2, name: 'Product 2', revenue: 278000, profit: 19, category: 'two' },
],
insightsData: [
  {
    clientId: 1,
    insight_id: 'i1',
    insight_title: 'Reports based on previous meetings',
    insight_brief:
      'The **Q3 revenue** for the Northeast region shows a significant **20% drop**, primarily due to the underperformance of **Product X**. This requires immediate investigation.',
    data_points: JSON.stringify({
      type: 'bar',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Revenue (M)',
          data: [150, 160, 128, 175],
          backgroundColor: ['#4caf50', '#4caf50', '#f44336', '#4caf50'],
        },
      ],
    }),
    confidence_score: 85,
    explainability_summary: JSON.stringify([
      'The primary driver for the revenue drop is a **supply chain disruption** affecting Product X.',
      '<strong>Competitor Z</strong> launched a similar product at a lower price in July.',
    ]),
    insight_faqs: JSON.stringify([
      { question: 'What is the recommended action?', answer: 'Immediately investigate the supply chain issue and run a competitive pricing analysis.' },
      { question: 'Is this trend expected to continue?', answer: 'If no intervention is made, the downward trend will likely continue into Q4.' },
    ]),
    has_query: true,
    sql_query: 'SELECT * FROM quarterly_revenue_data WHERE quarter = 3',
    query_result: [
      { Quarter: 'Q3', Region: 'Northeast', Product: 'Product X', Revenue: 128, Sales_Reps: 5 },
      { Quarter: 'Q3', Region: 'Northeast', Product: 'Product Y', Revenue: 85, Sales_Reps: 3 },
      { Quarter: 'Q3', Region: 'Midwest', Product: 'Product X', Revenue: 150, Sales_Reps: 6 },
    ],
  },
  {
    clientId: 2,
    insight_id: 'i2',
    insight_title: 'Loan default rates over the past year',
    insight_brief:
      "The monthly churn rate has stabilized at **5%**, which is within the historical average. <br>However, churn is concentrated among customers with 'Basic' tier subscriptions. The data shows <b>90% of churn</b> comes from the basic tier.",
    data_points: JSON.stringify({
      type: 'pie',
      labels: ['Basic Tier', 'Premium Tier', 'Enterprise Tier'],
      datasets: [
        {
          label: 'Churn %',
          data: [90, 8, 2],
          backgroundColor: ['#f44336', '#ffeb3b', '#4caf50'],
        },
      ],
    }),
    confidence_score: 65,
    explainability_summary: '',
    insight_faqs: JSON.stringify([{ question: 'What is the retention rate?', answer: 'The overall retention rate is 95%.' }]),
    has_query: true,
    sql_query: 'SELECT * FROM churn_data',
    query_result: [], // Simulating no query result yet
  },
  {
    clientId: 1,
    insight_id: 'i3',
    insight_title: 'The loan approval rate increased in the last quarter',
    insight_brief: 'The R&D budget utilization is currently at **75%**, slightly below the target of 80% for this period.',
    data_points: JSON.stringify({
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Utilization %',
          data: [60, 65, 70, 75, 75],
          borderColor: '#2196f3',
          fill: false,
        },
      ],
    }),
    confidence_score: 92,
    explainability_summary: null,
    insight_faqs: null,
    has_query: false,
    sql_query: null,
    query_result: null,
  },
   {
    clientId: 2,
    insight_id: 'i3',
    insight_title: 'Average score of loan applicants is 720',
    insight_brief: 'The R&D budget utilization is currently at **75%**, slightly below the target of 80% for this period.',
    data_points: JSON.stringify({
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Utilization %',
          data: [60, 65, 70, 75, 75],
          borderColor: '#2196f3',
          fill: false,
        },
      ],
    }),
    confidence_score: 92,
    explainability_summary: null,
    insight_faqs: null,
    has_query: false,
    sql_query: null,
    query_result: null,
  },
],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.homeScreenData = null;
      state.homeSummary = null;
      state.insightDetails = null;
      state.insightsScreenData = null;
      state.reportsData = null;
      state.loading = {
        home: true,
        insights: true,
      };
      state.dashboardCount = {
        insight: 0,
        reports: 0,
        artifacts: 0,
      };
      state.lastRefreshed = {
        home: null,
        insight: null,
      };
      state.error = null;
      state.queryResults = {};
      state.queryExecutionStates = {
        batchExecuting: false,
        totalQueries: 0,
        completedQueries: 0,
        failedQueries: 0,
      };
      state.dashboardReadiness = {
        home: false,
        insights: false,
      };
    },

    setChartFilters: (state, action) => {
      const { visualId, filters } = action.payload;
      if (visualId) {
        state.chartFilters[visualId] = filters;
      }
    },

    setLastRefreshed: (state, action) => {
      const { page, timestamp } = action.payload;
      state.lastRefreshed[page] = timestamp;
    },

    setHomeScreenData: (state, action) => {
      state.homeScreenData = action.payload;
      state.loading.home = false;
      state.error = null;
      if (state.homeSummary !== null) {
        state.dashboardReadiness.home = true;
      }
    },

    setInsightsScreenData: (state, action) => {
      let sortedData = action.payload;
      let isClientId4 = false;

      if (Array.isArray(action.payload)) {
        // This part remains the same...
        // But extract clientId metadata if provided
        if (action.meta && action.meta.clientId === 4) {
          isClientId4 = true;
        }
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        // Handle if payload includes metadata
        if (action.payload.clientId === 4) {
          isClientId4 = true;
          sortedData = action.payload.data;
        }
      }

      state.insightsScreenData = sortedData;
      state.dashboardCount.insight = sortedData?.length || 0;
      state.loading.insights = false;
      state.error = null;

      // Modified logic to account for clientId 4
      if (isClientId4 || state.insightDetails !== null) {
        state.dashboardReadiness.insights = true;
      }
    },

    setInsightDetails: (state, action) => {
      state.insightDetails = action.payload;
      state.error = null;
      // Check insights dashboard readiness
      if (state.insightsScreenData !== null) {
        state.dashboardReadiness.insights = true;
      }
    },

    setReportsData: (state, action) => {
      state.reportsData = action.payload;
      state.error = null;
    },

    setReportsCount: (state, action) => {
      state.dashboardCount = {
        ...state.dashboardCount,
        reports: action.payload,
      };
    },

    setArtifactsCount: (state, action) => {
      state.dashboardCount.artifacts = action.payload;
    },

    // Updated to support specific loading state changes
    setLoading: (state, action) => {
      if (typeof action.payload === 'boolean') {
        // For backward compatibility, set both loading states
        state.loading.home = action.payload;
        state.loading.insights = action.payload;
      } else if (typeof action.payload === 'object') {
        // Set specific loading state(s)
        if (action.payload.home !== undefined) {
          state.loading.home = action.payload.home;
        }
        if (action.payload.insights !== undefined) {
          state.loading.insights = action.payload.insights;
        }
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      // Error applies to both dashboards, but keep individual loading states
    },

    setHomeSummary: (state, action) => {
      state.homeSummary = action.payload;
      state.loading.home = false;
      state.error = null;
      // Check home dashboard readiness
      if (state.homeScreenData !== null) {
        state.dashboardReadiness.home = true;
      }
    },

    resetDashboard: () => initialState,

    // Query execution state management reducers
    setQueryExecutionBatch: (state, action) => {
      const { totalQueries } = action.payload;
      state.queryExecutionStates = {
        batchExecuting: true,
        totalQueries,
        completedQueries: 0,
        failedQueries: 0,
      };
    },

    setInsightQueryLoading: (state, action) => {
      const { insightId } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with loading state
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_loading: true,
            query_error: null,
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility
      if (!state.queryResults[insightId]) {
        state.queryResults[insightId] = {
          data: null,
          loading: true,
          error: null,
          executionTime: null,
        };
      } else {
        state.queryResults[insightId].loading = true;
        state.queryResults[insightId].error = null;
      }
    },

    setInsightQueryResult: (state, action) => {
      const { insightId, data, executionTime } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData instead of separate queryResults
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with query results
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_result: data || [],
            query_execution_time: executionTime || null,
            query_loading: false,
            query_error: null,
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility (can be removed later)
      state.queryResults[insightId] = {
        data: data || [],
        loading: false,
        error: null,
        executionTime: executionTime || null,
      };

      // Update batch execution progress
      if (state.queryExecutionStates.batchExecuting) {
        state.queryExecutionStates.completedQueries += 1;

        // Check if batch execution is complete
        const totalProcessed = state.queryExecutionStates.completedQueries + state.queryExecutionStates.failedQueries;
        if (totalProcessed >= state.queryExecutionStates.totalQueries) {
          state.queryExecutionStates.batchExecuting = false;
        }
      }
    },

    setInsightQueryError: (state, action) => {
      const { insightId, error } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with error
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_result: [],
            query_execution_time: null,
            query_loading: false,
            query_error: error || 'Unknown error occurred',
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility
      state.queryResults[insightId] = {
        data: null,
        loading: false,
        error: error || 'Unknown error occurred',
        executionTime: null,
      };

      if (state.queryExecutionStates.batchExecuting) {
        state.queryExecutionStates.failedQueries += 1;

        // Check if all queries are complete
        const totalProcessed = state.queryExecutionStates.completedQueries + state.queryExecutionStates.failedQueries;
        if (totalProcessed >= state.queryExecutionStates.totalQueries) {
          state.queryExecutionStates.batchExecuting = false;
        }
      }
    },

    updateBatchQueryResults: (state, action) => {
      const { results } = action.payload;

      if (Array.isArray(results)) {
        results.forEach((result) => {
          const { insight_id, success, data, execution_time, error } = result;

          if (success) {
            state.queryResults[insight_id] = {
              data: data || [],
              loading: false,
              error: null,
              executionTime: execution_time || null,
            };
            state.queryExecutionStates.completedQueries += 1;
          } else {
            state.queryResults[insight_id] = {
              data: null,
              loading: false,
              error: error || 'Query execution failed',
              executionTime: null,
            };
            state.queryExecutionStates.failedQueries += 1;
          }
        });
      }

      // Mark batch execution as complete
      state.queryExecutionStates.batchExecuting = false;
    },

    clearQueryResults: (state, action) => {
      if (action.payload) {
        // Clear specific insight query result
        const { insightId } = action.payload;
        delete state.queryResults[insightId];
      } else {
        // Clear all query results
        state.queryResults = {};
      }
    },

    resetQueryExecutionState: (state) => {
      state.queryExecutionStates = {
        batchExecuting: false,
        totalQueries: 0,
        completedQueries: 0,
        failedQueries: 0,
      };
    },

    setDashboardReadiness: (state, action) => {
      const { dashboard, ready } = action.payload;
      state.dashboardReadiness[dashboard] = ready;
    },

    resetDashboardReadiness: (state) => {
      state.dashboardReadiness = {
        home: false,
        insights: false,
      };
    },

    updateInsightQueryResult: (state, action) => {
      const { insightId, queryResult } = action.payload;

      // Find insight in insightsScreenData and update its query result
      if (state.insightsScreenData) {
        state.insightsScreenData = state.insightsScreenData.map((insight) => {
          if (insight.insight_id === insightId) {
            return {
              ...insight,
              query_result: queryResult.data,
              query_execution_time: queryResult.executionTime,
              query_loading: false,
              query_error: null,
            };
          }
          return insight;
        });
      }
    },

    updateInsightQueryError: (state, action) => {
      const { insightId, error } = action.payload;

      // Find insight and store error
      if (state.insightsScreenData) {
        state.insightsScreenData = state.insightsScreenData.map((insight) => {
          if (insight.insight_id === insightId) {
            return {
              ...insight,
              query_result: null,
              query_loading: false,
              query_error: error,
            };
          }
          return insight;
        });
      }
    },
    setKpiDashboardData: (state, action) => {
      state.KpiDashboardData = action.payload;
    },
    setDepositLoanDetails: (state, action) => {
      state.depositLoanDetails = action.payload;
    },
    setLoanOutstandingDetails: (state, action) => {
      state.loanOutstandingDetails = action.payload;
    },
    setRevenueGraphDetails: (state, action) => {
      state.revenueGraphDetails = action.payload;
    },
    setTotalProfitandLossRelationship: (state, action) => {
      state.TotalProfitandLossRelationship = action.payload;
    },
    setEngagementDetails: (state, action) => {
      state.engagementDetails = action.payload;
    },
    setVolumeOfUsageDetails: (state, action) => {
      state.volumeOfUsageDetails = action.payload;
    },
    setRevenueAndProfitAtProductLevelDetails: (state, action) => {
      state.revenueAndProfitAtProductLevel = action.payload;
    },
    setinsightsDataDetails: (state, action) => {
      state.insightsData = action.payload;
    },
  },
});

// Export actions
export const {
  setArtifactsCount,
  setChartFilters,
  clearDashboardData,
  setLastRefreshed,
  setHomeScreenData,
  setInsightsScreenData,
  setInsightDetails,
  setReportsData,
  setReportsCount,
  setLoading,
  setError,
  setHomeSummary,
  resetDashboard,
  // Query execution actions
  setQueryExecutionBatch,
  setInsightQueryLoading,
  setInsightQueryResult,
  setInsightQueryError,
  updateBatchQueryResults,
  clearQueryResults,
  resetQueryExecutionState,
  // Dashboard readiness actions
  setDashboardReadiness,
  resetDashboardReadiness,
  setKpiDashboardData,
  setDepositLoanDetails,
  setLoanOutstandingDetails,
  setRevenueGraphDetails,
  setTotalProfitandLossRelationship,
  setAccountDetails,
  setEngagementDetails,
  setTeamDetails,
  setVolumeOfUsageDetails,
  setRevenueAndProfitAtProductLevelDetails,
  setinsightsDataDetails,
} = dashboardSlice.actions;

// Selectors
export const selectHomeScreenData = (state) => state.dashboard?.homeScreenData;
export const selectInsightsScreenData = (state) => state.dashboard?.insightsScreenData;
export const selectReportsData = (state) => state.dashboard?.reportsData;
export const selectChartFilters = (state) => state.dashboard.chartFilters;

// Updated selectors for separate loading states
export const selectDashboardLoading = (state) => state.dashboard?.loading ?? { home: true, insights: true };
export const selectHomeDashboardLoading = (state) => state.dashboard?.loading?.home ?? true;
export const selectInsightsDashboardLoading = (state) => state.dashboard?.loading?.insights ?? true;

export const selectDashboardError = (state) => state.dashboard?.error;
export const selectHomeSummary = (state) => state.dashboard?.homeSummary;
export const selectDashboardCount = (state) =>
  state.dashboard?.dashboardCount || { insight: 0, reports: 0, artifacts: 0 };
export const selectInsightDetails = (state) => state.dashboard?.insightDetails;
export const selectLastRefreshed = (state) => state.dashboard?.lastRefreshed || { home: null, insight: null };

// Query execution selectors
export const selectQueryResults = (state) => state.dashboard?.queryResults || {};
export const selectInsightQueryResult = (state, insightId) => {
  return (
    state.dashboard?.queryResults?.[insightId] || {
      data: null,
      loading: false,
      error: null,
      executionTime: null,
    }
  );
};

export const selectQueryExecutionStates = (state) =>
  state.dashboard?.queryExecutionStates || {
    batchExecuting: false,
    totalQueries: 0,
    completedQueries: 0,
    failedQueries: 0,
  };

// Dashboard readiness selectors
export const selectDashboardReadiness = (state) =>
  state.dashboard?.dashboardReadiness || {
    home: false,
    insights: false,
  };
export const selectHomeDashboardReady = (state) => state.dashboard?.dashboardReadiness?.home || false;
export const selectInsightsDashboardReady = (state) => state.dashboard?.dashboardReadiness?.insights || false;

// Computed selectors
export const selectQueryExecutionProgress = (state) => {
  const states = selectQueryExecutionStates(state);
  if (states.totalQueries === 0) return { percentage: 0, completed: 0, total: 0 };

  const completed = states.completedQueries + states.failedQueries;
  const percentage = Math.round((completed / states.totalQueries) * 100);

  return {
    percentage,
    completed,
    total: states.totalQueries,
    isExecuting: states.batchExecuting,
  };
};

export const selectInsightsWithQueryData = (state) => {
  const insights = selectInsightsScreenData(state);
  const queryResults = selectQueryResults(state);

  if (!insights || !Array.isArray(insights)) return [];

  return insights.map((insight) => ({
    ...insight,
    queryResult: queryResults[insight.insight_id] || {
      data: null,
      loading: false,
      error: null,
      executionTime: null,
    },
  }));
};

export const selectKpiDashboardData = (state) => {
  return state.dashboard?.KpiDashboardData || { kpis: [], score: [] };
};

export const selectDepositLoanDetails = (state) => {
  return state.dashboard?.depositLoanDetails || {};
};

export const selectLoanOutstandingDetails = (state) => {
  return state.dashboard?.loanOutstandingDetails || {};
};

export const selectRevenueGraphDetails = (state) => {
  return state.dashboard?.revenueGraphDetails || {};
};

export const selectTotalProfitandLossRelationship = (state) => {
  return state.dashboard?.TotalProfitandLossRelationship || {};
};

export const selectEngagementDetails = (state) => {
  return state.dashboard?.engagementDetails || [];
};

export const selectVolumeOfUsageDetails = (state) => {
  return state.dashboard?.volumeOfUsageDetails || [];
};

export const selectrevenueAndProfitAtProductLevelDetails = (state) => {
  return state.dashboard?.revenueAndProfitAtProductLevel || [];
};
export const selectInsightsDatalDetails = (state) => {
  return state.dashboard?.insightsData || [];
};

export default dashboardSlice.reducer;
