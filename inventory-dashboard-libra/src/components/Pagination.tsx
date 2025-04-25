import Button from "./Button";
import styles from "./Pagination.module.css";

interface Props {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}
export default function Pagination({ page, pages, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <Button
        size="sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span className={styles.text}>
        Page&nbsp;{page}&nbsp;of&nbsp;{pages}
      </span>
      <Button
        size="sm"
        variant="ghost"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
