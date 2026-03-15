import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import StreamingPlugin from 'chartjs-plugin-streaming';
import { StockId } from '../types/game';
import { useGameStore } from '../store/useGameStore';

// Register necessary components for Chart.js 3
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  StreamingPlugin
);

interface Props {
  stockId: StockId;
  color?: string;
}

const RealtimeChart: React.FC<Props> = ({ stockId, color = '#3b82f6' }) => {
  const stockName = useGameStore.getState().stocks[stockId].name;

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'realtime' as const,
        realtime: {
          duration: 30000,
          refresh: 1000,
          delay: 1000,
          onRefresh: (chart: any) => {
            const currentPrice = useGameStore.getState().stocks[stockId].currentPrice;
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: currentPrice,
            });
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false, // v3 specific
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.4)',
          font: {
            size: 10,
            family: 'monospace'
          }
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      streaming: {
        frameRate: 30,
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      }
    },
    animation: {
      duration: 0,
    },
    // v3 doesn't need 'datasets' root, it's defined in scales or elements
  }), [stockId]);

  const data = useMemo(() => ({
    datasets: [
      {
        label: stockName,
        data: [],
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  }), [stockName, color]);

  return (
    <div className="w-full h-full min-h-[150px] relative">
      {/* react-chartjs-2 v4 uses normal props */}
      <Line 
        options={options as any} 
        data={data} 
      />
    </div>
  );
};

export default RealtimeChart;
