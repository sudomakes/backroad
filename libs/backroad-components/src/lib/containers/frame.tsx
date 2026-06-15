import { ReactNode } from 'react';
import { BackroadContainer } from '@backroad/core';
import { TreeRender } from '../tree';

type FrameNodes = BackroadContainer<'base', true>['children'];

type FrameSlots = {
  /** Body nodes (everything that isn't a `bottom` dock), rendered + keyed. */
  body: ReactNode;
  /** Dock nodes (the `bottom` children), rendered + keyed. */
  dock: ReactNode;
  hasDock: boolean;
};

type FrameProps = {
  nodes: FrameNodes;
  children: (slots: FrameSlots) => ReactNode;
};

// Frame owns the two things that must stay correct: splitting children into a
// scrolling body and a pinned `bottom` dock, and rendering each node with a
// stable `key={path}` so the message log is never remounted (a remount resets
// scroll position and input focus — the HIGH-impact React footgun).
//
// It hands back the already-rendered, correctly-keyed element arrays and lets
// the caller compose whatever structure it wants around them — a sticky header,
// scroll shadows, custom dock chrome, per-container layout. Callers cannot
// mis-key (Frame did the mapping); the one thing they own is keeping their
// skeleton stable across the no-dock <-> dock toggle if they want to avoid a
// remount (Page and Base do, via a single skeleton + `display: contents`).
export const Frame = ({ nodes, children }: FrameProps) => {
  const bodyNodes: FrameNodes = [];
  const dockNodes: FrameNodes = [];
  for (const child of nodes) {
    (child.type === 'bottom' ? dockNodes : bodyNodes).push(child);
  }

  const render = (list: FrameNodes) =>
    list.map((child) => <TreeRender tree={child} key={child.path} />);

  return (
    <>
      {children({
        body: render(bodyNodes),
        dock: render(dockNodes),
        hasDock: dockNodes.length > 0,
      })}
    </>
  );
};
