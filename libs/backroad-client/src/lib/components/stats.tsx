import { BackroadComponentRenderer } from '../types/components';

export const Stats: BackroadComponentRenderer<'stats'> = (props) => {
  return (
    <div className="stats shadow">
      {props.args.items.map((item) => {
        const deltaType =
          item.delta === undefined
            ? undefined
            : typeof item.delta === 'number'
            ? item.delta > 0
            : !item.delta.startsWith('-');
        return (
          <div className="stat">
            {/* <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div> */}
            <div className="stat-title">{item.label}</div>
            <div className="stat-value text-primary">{item.value}</div>

            {item.delta !== undefined && (
              <div
                className={`stat-desc flex gap-2 mt-2 text-lg items-center ${
                  deltaType ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {deltaType === true ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0v6z"
                    />
                  </svg>
                )}{' '}
                {item.delta}
              </div>
            )}
          </div>
        );
      })}

      {/* <div className="stat">
      <div className="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div className="stat-title">Page Views</div>
      <div className="stat-value text-secondary">2.6M</div>
      <div className="stat-desc">21% more than last month</div>
    </div>
    
    <div className="stat">
      <div className="stat-figure text-secondary">
        <div className="avatar online">
          <div className="w-16 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
      </div>
      <div className="stat-value">86%</div>
      <div className="stat-title">Tasks done</div>
      <div className="stat-desc text-secondary">31 tasks remaining</div>
    </div> */}
    </div>
  );
};
