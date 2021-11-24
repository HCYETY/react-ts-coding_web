import { ReactNode } from "_@types_react@16.14.21@@types/react";

export interface testObj {
  test_name: string;
  level: string;
  tags: string[];
  test: string;
}
interface arrayoBJ {
  path: string;
  breadcrumbName: string;
}
export interface Route {
  path: string;
  breadcrumbName: string;
  component: ReactNode;
  children?: Array<{
    path: string;
    breadcrumbName: string;
    component: ReactNode;
  }>;
}