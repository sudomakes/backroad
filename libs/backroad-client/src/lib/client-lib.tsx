import styles from './client-lib.module.scss';

/* eslint-disable-next-line */
export interface ClientLibProps {}

export function ClientLib(props: ClientLibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ClientLib!</h1>
    </div>
  );
}

export default ClientLib;
