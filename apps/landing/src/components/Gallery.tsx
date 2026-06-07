import './Gallery.css';

const chartHtml = `<span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">line</span><span class="t-punc">({</span>
  data<span class="t-punc">:</span> <span class="t-punc">[</span>1<span class="t-punc">,</span> 4<span class="t-punc">,</span> 2<span class="t-punc">,</span> 8<span class="t-punc">,</span> 6<span class="t-punc">,</span> 9<span class="t-punc">],</span>
  labels<span class="t-punc">:</span> months<span class="t-punc">,</span>
<span class="t-punc">});</span>`;

const formHtml = `<span class="t-keyword">const</span> email <span class="t-punc">=</span> <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">textInput</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-string">'Email'</span> <span class="t-punc">});</span>
<span class="t-keyword">const</span> tier <span class="t-punc">=</span> <span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">select</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-string">'Plan'</span><span class="t-punc">,</span> options <span class="t-punc">});</span>
<span class="t-keyword">if</span> <span class="t-punc">(</span><span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">button</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-string">'Subscribe'</span> <span class="t-punc">}))</span>
  <span class="t-fn">subscribe</span><span class="t-punc">(</span>email<span class="t-punc">,</span> tier<span class="t-punc">);</span>`;

const tableHtml = `<span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">table</span><span class="t-punc">({</span>
  columns<span class="t-punc">:</span> <span class="t-punc">[</span><span class="t-string">'id'</span><span class="t-punc">,</span> <span class="t-string">'name'</span><span class="t-punc">,</span> <span class="t-string">'tier'</span><span class="t-punc">],</span>
  rows<span class="t-punc">:</span> <span class="t-keyword">await</span> <span class="t-var">db</span><span class="t-punc">.</span><span class="t-fn">users</span><span class="t-punc">.</span><span class="t-fn">findMany</span><span class="t-punc">(),</span>
<span class="t-punc">});</span>`;

export function Gallery() {
  return (
    <section className="gallery shell">
      <header className="g-head">
        <p className="eyebrow">Eight lines or fewer</p>
        <h2>Components are method&nbsp;calls.</h2>
        <p className="sub">
          Every component lives on the typed <code>br</code> proxy. Pass props
          in, get state out. The framework handles the React, the socket, the
          rerender.
        </p>
      </header>

      <div className="cards">
        <article className="card">
          <pre className="snippet">
            <code dangerouslySetInnerHTML={{ __html: chartHtml }} />
          </pre>
          <div className="render render-chart">
            <svg
              viewBox="0 0 200 80"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                points="0,60 40,30 80,50 120,8 160,22 200,4"
              />
              <line
                x1="0"
                y1="78"
                x2="200"
                y2="78"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </svg>
            <ul className="legend">
              <li>jan</li>
              <li>feb</li>
              <li>mar</li>
              <li>apr</li>
              <li>may</li>
              <li>jun</li>
            </ul>
          </div>
        </article>

        <article className="card">
          <pre className="snippet">
            <code dangerouslySetInnerHTML={{ __html: formHtml }} />
          </pre>
          <div className="render render-form">
            <label>
              <span>Email</span>
              <input type="text" defaultValue="you@example.com" readOnly />
            </label>
            <label>
              <span>Plan</span>
              <div className="fake-select">
                Pro <span aria-hidden="true">▾</span>
              </div>
            </label>
            <button className="fake-btn">Subscribe</button>
          </div>
        </article>

        <article className="card">
          <pre className="snippet">
            <code dangerouslySetInnerHTML={{ __html: tableHtml }} />
          </pre>
          <div className="render render-table">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>tier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Ada Lovelace</td>
                  <td>Pro</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Grace Hopper</td>
                  <td>Pro</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Alan Turing</td>
                  <td>Free</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Linus T.</td>
                  <td>Pro</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
