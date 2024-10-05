import { formatDistanceToNow } from "date-fns";

const timeAgo = (date: string | Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  };

export default timeAgo;