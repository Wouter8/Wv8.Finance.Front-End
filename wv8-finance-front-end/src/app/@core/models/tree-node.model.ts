import { Category } from "./category.model";
import { Maybe } from "wv8.typescript.core";

export interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
  expanded: boolean;
}

export namespace TreeNode {
  export function fromCategories(categories: Category[]): TreeNode<Category>[] {
    return categories.map(c => {
      let node: TreeNode<Category> = {
        data: c,
        children: TreeNode.fromCategories(c.children),
        expanded: false
      };

      return node;
    });
  }
}
