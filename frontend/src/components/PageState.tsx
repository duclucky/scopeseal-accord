import type { ReactNode } from "react";

type PageStateProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export function PageState({ eyebrow, title, children, action }: PageStateProps) {
  return (
    <section className="page-state" aria-labelledby="page-state-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id="page-state-title">{title}</h2>
      <div className="page-state-copy">{children}</div>
      {action ? <div className="page-state-action">{action}</div> : null}
    </section>
  );
}
