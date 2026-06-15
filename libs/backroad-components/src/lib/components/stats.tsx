import { BackroadComponentRenderer } from '../types/components';

export const Stats: BackroadComponentRenderer<'stats'> = (props) => {
  return (
    <div className="flex min-h-[100px] flex-wrap divide-x divide-border rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      {props.args.items.map((item) => {
        const deltaType =
          item.delta === undefined
            ? undefined
            : typeof item.delta === 'number'
            ? item.delta > 0
            : !item.delta.startsWith('-');
        return (
          <div className="flex flex-col gap-1 px-6 py-4" key={item.label}>
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="text-2xl font-semibold text-primary">
              {item.value}
            </div>

            {item.delta !== undefined && (
              <div
                className={`mt-2 flex items-center gap-2 text-lg ${
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
                      fillRule="evenodd"
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
                      fillRule="evenodd"
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
    </div>
  );
};
