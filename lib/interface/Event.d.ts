import { Category } from './Category';

export declare type Event = {
  id: number;
  publish_date: string;
  title: string;
  Contact: string;
  category: Category[];
  top_category_style: string;
  quick_link: string[];
  category_detail: string;
  category_detail_style: string;
  periodstart: string;
  periodend: string;
  dates: string;
  term: string;
  opening_time: string;
  open_time: string;
  entrance: string;
  thumbnail: string;
  detail_url: string;
  other_site: string;
  note: string;
};
