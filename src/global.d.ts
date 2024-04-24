declare const __DEV__: boolean;
/** Extension name, defined in packageJson.name */
declare const __NAME__: string;

declare module "*.vue" {
  const component: any;
  export default component;
}

export type Memo = {
  content: string;
  creator_id: number;
  source: string;
  tags: string[];
  pin: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  slug: string;
  linked_count: number;
  files: any[];
  links: string[];
  created_at_long: number;
  deleted_at_long: number;
  updated_at_long: number;
  id: number;
};
