import './Compare.css';
import { GridMark } from './GridMark';

const withoutHtml = `<span class="t-comment">// server/api/counter.ts — 1 of 2 files</span>
<span class="t-keyword">import</span> <span class="t-punc">{</span> Router <span class="t-punc">}</span> <span class="t-keyword">from</span> <span class="t-string">'express'</span><span class="t-punc">;</span>
<span class="t-keyword">const</span> r <span class="t-punc">=</span> <span class="t-fn">Router</span><span class="t-punc">();</span>
<span class="t-keyword">let</span> count <span class="t-punc">=</span> <span class="t-num">0</span><span class="t-punc">;</span>
r<span class="t-punc">.</span><span class="t-fn">get</span><span class="t-punc">(</span><span class="t-string">'/'</span><span class="t-punc">,</span> <span class="t-punc">(_, res) =&gt; res.</span><span class="t-fn">json</span><span class="t-punc">({</span> count <span class="t-punc">}));</span>
r<span class="t-punc">.</span><span class="t-fn">post</span><span class="t-punc">(</span><span class="t-string">'/'</span><span class="t-punc">,</span> <span class="t-punc">(_, res) =&gt; res.</span><span class="t-fn">json</span><span class="t-punc">({</span> count<span class="t-punc">:</span> <span class="t-punc">++</span>count <span class="t-punc">}));</span>
<span class="t-keyword">export</span> <span class="t-keyword">default</span> r<span class="t-punc">;</span>

<span class="t-comment">// client/Counter.tsx — 2 of 2 files</span>
<span class="t-keyword">import</span> <span class="t-punc">{</span> useEffect<span class="t-punc">,</span> useState <span class="t-punc">}</span> <span class="t-keyword">from</span> <span class="t-string">'react'</span><span class="t-punc">;</span>
<span class="t-keyword">export</span> <span class="t-keyword">function</span> <span class="t-fn">Counter</span><span class="t-punc">() {</span>
  <span class="t-keyword">const</span> <span class="t-punc">[</span>count<span class="t-punc">,</span> setCount<span class="t-punc">]</span> <span class="t-punc">=</span> <span class="t-fn">useState</span><span class="t-punc">&lt;</span><span class="t-keyword">number</span> <span class="t-punc">|</span> <span class="t-keyword">null</span><span class="t-punc">&gt;(</span><span class="t-keyword">null</span><span class="t-punc">);</span>
  <span class="t-fn">useEffect</span><span class="t-punc">(() =&gt; {</span>
    <span class="t-fn">fetch</span><span class="t-punc">(</span><span class="t-string">'/api/counter'</span><span class="t-punc">)</span>
      <span class="t-punc">.</span><span class="t-fn">then</span><span class="t-punc">((</span>r<span class="t-punc">) =&gt;</span> r<span class="t-punc">.</span><span class="t-fn">json</span><span class="t-punc">())</span>
      <span class="t-punc">.</span><span class="t-fn">then</span><span class="t-punc">((</span>d<span class="t-punc">) =&gt;</span> <span class="t-fn">setCount</span><span class="t-punc">(</span>d<span class="t-punc">.</span>count<span class="t-punc">));</span>
  <span class="t-punc">},</span> <span class="t-punc">[]);</span>
  <span class="t-keyword">async</span> <span class="t-keyword">function</span> <span class="t-fn">inc</span><span class="t-punc">() {</span>
    <span class="t-keyword">const</span> r <span class="t-punc">=</span> <span class="t-keyword">await</span> <span class="t-fn">fetch</span><span class="t-punc">(</span><span class="t-string">'/api/counter'</span><span class="t-punc">,</span> <span class="t-punc">{</span> method<span class="t-punc">:</span> <span class="t-string">'POST'</span> <span class="t-punc">});</span>
    <span class="t-fn">setCount</span><span class="t-punc">((</span><span class="t-keyword">await</span> r<span class="t-punc">.</span><span class="t-fn">json</span><span class="t-punc">()).</span>count<span class="t-punc">);</span>
  <span class="t-punc">}</span>
  <span class="t-keyword">if</span> <span class="t-punc">(</span>count <span class="t-punc">===</span> <span class="t-keyword">null</span><span class="t-punc">)</span> <span class="t-keyword">return</span> <span class="t-punc">&lt;</span><span class="t-fn">p</span><span class="t-punc">&gt;</span>Loading…<span class="t-punc">&lt;/</span><span class="t-fn">p</span><span class="t-punc">&gt;;</span>
  <span class="t-keyword">return</span> <span class="t-punc">&lt;</span><span class="t-fn">button</span> onClick<span class="t-punc">={</span>inc<span class="t-punc">}&gt;{</span>count<span class="t-punc">}&lt;/</span><span class="t-fn">button</span><span class="t-punc">&gt;;</span>
<span class="t-punc">}</span>`;

const withHtml = `<span class="t-comment">// app.ts — 1 of 1 file</span>
<span class="t-keyword">import</span> <span class="t-punc">{</span> run <span class="t-punc">}</span> <span class="t-keyword">from</span> <span class="t-string">'@backroad/backroad'</span><span class="t-punc">;</span>

<span class="t-keyword">let</span> count <span class="t-punc">=</span> <span class="t-num">0</span><span class="t-punc">;</span>

<span class="t-fn">run</span><span class="t-punc">((</span><span class="t-var">br</span><span class="t-punc">) =&gt; {</span>
  <span class="t-keyword">if</span> <span class="t-punc">(</span><span class="t-var">br</span><span class="t-punc">.</span><span class="t-fn">button</span><span class="t-punc">({</span> label<span class="t-punc">:</span> <span class="t-fn">String</span><span class="t-punc">(</span>count<span class="t-punc">) })) {</span>
    count<span class="t-punc">++;</span>
  <span class="t-punc">}</span>
<span class="t-punc">});</span>`;

export function Compare() {
  return (
    <section className="compare shell">
      <div className="compare-head">
        <p className="eyebrow">A button that counts clicks</p>
        <h2>Same feature. Two codebases.</h2>
        <p className="sub">
          The conventional stack on the left. Backroad on the right. Both do the
          same thing — the right one is the whole app.
        </p>
      </div>

      <div className="compare-grid">
        <article className="col col-conventional">
          <header>
            <span className="tag tag-muted">
              Conventional · 2 files · 27 lines
            </span>
          </header>
          <pre className="code">
            <code dangerouslySetInnerHTML={{ __html: withoutHtml }} />
          </pre>
        </article>

        <div className="vs" aria-hidden="true">
          <GridMark size={28} opacity={0.65} />
        </div>

        <article className="col col-backroad">
          <header>
            <span className="tag tag-accent">Backroad · 1 file · 8 lines</span>
          </header>
          <pre className="code">
            <code dangerouslySetInnerHTML={{ __html: withHtml }} />
          </pre>
        </article>
      </div>
    </section>
  );
}
