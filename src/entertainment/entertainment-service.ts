import { Department } from './entertainment';
import { Employee } from './entertainment';
import { Drama } from './entertainment';

export interface DepartmentService {
    getAllDepartments(): Promise<Department[]>;
    getDepartmentByCode(dept_code: string): Promise<Department>;
}

export interface EmployeeService {
    getEmployeeDetails(): Promise<Employee[]>;
    getEmployeeByCode(emp_code: string): Promise<Employee>;
    getEmployeeByName(name: string): Promise<Employee>;
}

export interface DramaService {
    getDramasByProducer(producer: string): Promise<Drama[]>;
    getDramasByChannel(channel: string): Promise<Drama[]>;
    getDramasWithoutAirDate(): Promise<Drama[]>;
}
