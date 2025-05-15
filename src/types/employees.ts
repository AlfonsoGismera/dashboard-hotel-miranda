
export interface Employee {

  employeeId: string;
  name: string;
  jobDesk: string;
  hireDate: string;
  schedule: string[];
  contact: string;
  status: 'Active' | 'Inactive';
  image: string;
}


export interface MenuState {

  visible: boolean;
  employee: Employee | null;
}
