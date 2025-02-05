import { Client } from 'pg';
import { Department } from './entertainment';
import { Employee } from './entertainment';
import { Drama } from './entertainment';
import { setConnection } from '../common/postgres-access';
import { DepartmentService } from './entertainment-service';
import { EmployeeService } from './entertainment-service';
import { DramaService } from './entertainment-service';

export class PostgresDepartmentService implements DepartmentService {
    async getAllDepartments(): Promise<Department[]> {
        const query = "SELECT dept_code, dept_name, dept_loc FROM department";
        const client = await setConnection();

        try {
            const result = await client.query(query);
            return result.rows.map(row => new Department(row.dept_code, row.dept_name, row.dept_loc));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getDepartmentByCode(dept_code: string): Promise<Department> {
        const query = "SELECT dept_code, dept_name, dept_loc FROM department WHERE dept_code = $1";
        const client = await setConnection();

        try {
            const result = await client.query(query, [dept_code]);
            return new Department(result.rows[0].dept_code, result.rows[0].dept_name, result.rows[0].dept_loc);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Department();
        } finally {
            await client.end();
        }
    }

    async getDepartments(): Promise<Department[]> {
        const query = "SELECT dept_code, dept_name, dept_loc FROM department";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => new Department(row.dept_code, row.dept_name, row.dept_loc));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getEmployees(): Promise<Employee[]> {
        const query = "SELECT emp_code, emp_name, emp_mgt, emp_sal FROM employee";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getDramasByProducer(drm_prd: string): Promise<Drama[]> {
        const query = "SELECT drm_code, drm_name FROM drama WHERE drm_prd = $1";
        const client = await setConnection();
        try {
            const result = await client.query(query, [drm_prd]);
            return result.rows.map(row => new Drama(row.drm_code, row.drm_name));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getDramasByNetwork(drm_brd: string[]): Promise<Drama[]> {
        const query = "SELECT drm_code, drm_name FROM drama WHERE drm_brd IN ($1, $2)";
        const client = await setConnection();
        try {
            const result = await client.query(query, [drm_brd[0], drm_brd[1]]);
            return result.rows.map(row => new Drama(row.drm_code, row.drm_name));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getUniqueProducers(): Promise<string[]> {
        const query = "SELECT DISTINCT drm_brd FROM drama";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => row.drm_brd);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getSalarySummary(): Promise<{ total: number, average: number }> {
        const query = "SELECT SUM(emp_sal) AS total_salary, AVG(emp_sal) AS avg_salary FROM employee";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            const { total_salary, avg_salary } = result.rows[0];
            return { total: total_salary, average: avg_salary };
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return { total: 0, average: 0 };
        } finally {
            await client.end();
        }
    }

    async getUnconfirmedDramas(): Promise<string[]> {
        const query = "SELECT drm_name FROM drama WHERE drm_opdate IS NULL";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => row.drama_name);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getEmployeesWithManagers(): Promise<{ emp_name: string, manager_name: string }[]> {
        const query = `
        SELECT e.emp_name, m.emp_name
        FROM employee e
        LEFT JOIN employee m ON e.emp_mgt = m.emp_code
    `;
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getSortedEmployees(): Promise<Employee[]> {
        const query = "SELECT emp_name, emp_sal FROM employee ORDER BY emp_sal DESC, emp_name ASC";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => new Employee(row.emp_name, row.emp_sal));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getSalaryByRole(): Promise<{ emp_name: string, avg_sal: number }[]> {
        const query = `
        SELECT emp_name, AVG(emp_sal) AS avg_salary
        FROM employee
        GROUP BY emp_name
        HAVING AVG(emp_sal) >= 5000
    `;
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getHighSalaryEmployees(): Promise<{ emp_name: string, emp_sal: number }[]> {
        const query = `
        SELECT emp_name, emp_sal
        FROM employee
        WHERE emp_sal > (SELECT AVG(emp_sal) FROM employee)
    `;
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async updateDramaAirDate(): Promise<void> {
        const query = "UPDATE drama SET drm_opdate = CURRENT_DATE WHERE drm_opdate IS NULL";
        const client = await setConnection();
        try {
            await client.query(query);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
        } finally {
            await client.end();
        }
    }

    async promoteEmployee(dept_name: string): Promise<void> {
        const query = `
        UPDATE employee
        SET dept_name = 'R003', emp_sal = emp_sal * 1.1
        WHERE emp_name = $1
    `;
        const client = await setConnection();
        try {
            await client.query(query, [dept_name]);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
        } finally {
            await client.end();
        }
    }

    async addExecutive(executive: { emp_code: string, emp_name: string, salary: number }): Promise<void> {
        const query = `
        INSERT INTO employee (emp_code, emp_name, emp_mgt, emp_sal)
        VALUES ($1, $2, 'Executive')
    `;
        const client = await setConnection();
        try {
            await client.query(query, [executive.emp_code, executive.emp_name, executive.salary]);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
        } finally {
            await client.end();
        }
    }

    async removeEmployee(empName: string): Promise<void> {
        const query = "DELETE FROM employee WHERE emp_name = $1";
        const client = await setConnection();
        try {
            await client.query(query, [empName]);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
        } finally {
            await client.end();
        }
    }

}
// Employee 서비스 구현
export class PostgresEmployeeService implements EmployeeService {
    async getEmployeeDetails(): Promise<Employee[]> {
        const query = "SELECT emp_code, emp_name, emp_mgt, emp_sal FROM employee";
        const client = await setConnection();

        try {
            const result = await client.query(query);
            return result.rows.map(row => new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getEmployeeByCode(emp_code: string): Promise<Employee> {
        const query = "SELECT emp_code, emp_name, emp_mgt, emp_sal FROM employee WHERE emp_code = $1";
        const client = await setConnection();

        try {
            const result = await client.query(query, [emp_code]);
            return new Employee(result.rows[0].emp_code, result.rows[0].emp_name, result.rows[0].emp_mgt, result.rows[0].emp_sal);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Employee();
        } finally {
            await client.end();
        }
    }

    async getEmployeeByName(name: string): Promise<Employee> {
        const query = "SELECT emp_code, emp_name, emp_mgt, emp_sal FROM employee WHERE emp_name = $1";
        const client = await setConnection();

        try {
            const result = await client.query(query, [name]);
            return new Employee(result.rows[0].emp_code, result.rows[0].emp_name, result.rows[0].emp_mgt, result.rows[0].emp_sal);
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Employee();
        } finally {
            await client.end();
        }
    }

    async getEmployees(): Promise<Employee[]> {
        const query = "SELECT emp_code, emp_name, emp_mgt, emp_sal FROM employee";
        const client = await setConnection();
        try {
            const result = await client.query(query);
            return result.rows.map(row => new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

}

// Drama 서비스 구현
export class PostgresDramaService implements DramaService {
    async getDramasByProducer(producer: string): Promise<Drama[]> {
        const query = "SELECT drm_code, drm_name, drm_prd, drm_brd, drm_opdate FROM drama WHERE drm_prd = $1";
        const client = await setConnection();

        try {
            const result = await client.query(query, [producer]);
            return result.rows.map(row => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getDramasByChannel(channel: string): Promise<Drama[]> {
        const query = "SELECT drm_code, drm_name, drm_prd, drm_brd, drm_opdate FROM drama WHERE drm_brd = $1";
        const client = await setConnection();

        try {
            const result = await client.query(query, [channel]);
            return result.rows.map(row => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

    async getDramasWithoutAirDate(): Promise<Drama[]> {
        const query = "SELECT drm_code, drm_name, drm_prd, drm_brd, drm_opdate FROM drama WHERE drm_opdate IS NULL";
        const client = await setConnection();

        try {
            const result = await client.query(query);
            return result.rows.map(row => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        } catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        } finally {
            await client.end();
        }
    }

}
