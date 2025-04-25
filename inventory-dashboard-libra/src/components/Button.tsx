import React, { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import styles from './Button.module.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
};
export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cx(styles.btn, styles[variant], styles[size], className)}
    />
  );
}
