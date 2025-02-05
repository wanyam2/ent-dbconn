import { setConnection } from "../common/postgres-access";
import { Department } from "./entertainment";
import { Drama } from "./entertainment";
import { Employee } from "./entertainment";

import type { DepartmentService } from "./entertainment-service";
import type { DramaService } from "./entertainment-service";
import type { EmployeeService } from "./entertainment-service";

import { formatDateToYYYYMMDD } from "../common/util";
import * as console from "node:console";
import mybatisMapper from "mybatis-mapper";
import path from "node:path";

const mapperPath = path.resolve(__dirname, "./mapper/entertainment.xml");
mybatisMapper.createMapper([mapperPath]);

const format: mybatisMapper.Format = {
    language: "sql",
    indent: "  ",
};

export class MyBatisDepartmentService implements DepartmentService {
    async getAllDepartments(): Promise<Department[]> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("department", "getAllDepartments", {}, format);
            const queryResult = await dbClient.query(sqlQuery);
            return queryResult.rows.map((row: any) => new Department(row.dept_code, row.dept_name, row.dept_loc));
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        }
        finally {
            await dbClient.end();
        }
    }

    async getDepartmentByCode(dept_code: string): Promise<Department> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("department", "getDepartmentByCode", { dept_code }, format);
            const queryResult = await dbClient.query(sqlQuery);
            if (queryResult.rows.length > 0) {
                const row = queryResult.rows[0];
                return new Department(row.dept_code, row.dept_name, row.dept_loc);
            }
            return new Department();
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Department();
        }
        finally {
            await dbClient.end();
        }
    }
}

export class MyBatisEmployeeService implements EmployeeService {
    async getEmployeeDetails(): Promise<Employee[]> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("employee", "getEmployeeDetails", {}, format);
            const queryResult = await dbClient.query(sqlQuery);
            return queryResult.rows.map((row: any) => new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal));
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        }
        finally {
            await dbClient.end();
        }
    }

    async getEmployeeByCode(emp_code: string): Promise<Employee> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("employee", "getEmployeeByCode", { emp_code }, format);
            const queryResult = await dbClient.query(sqlQuery);
            if (queryResult.rows.length > 0) {
                const row = queryResult.rows[0];
                return new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal);
            }
            return new Employee();
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Employee();
        }
        finally {
            await dbClient.end();
        }
    }

    async getEmployeeByName(name: string): Promise<Employee> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("employee", "getEmployeeByName", { name }, format);
            const queryResult = await dbClient.query(sqlQuery);
            if (queryResult.rows.length > 0) {
                const row = queryResult.rows[0];
                return new Employee(row.emp_code, row.emp_name, row.emp_mgt, row.emp_sal);
            }
            return new Employee();
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return new Employee();
        }
        finally {
            await dbClient.end();
        }
    }
}

export class MyBatisDramaService implements DramaService {
    async getDramasByProducer(producer: string): Promise<Drama[]> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("drama", "getDramasByProducer", { producer }, format);
            const queryResult = await dbClient.query(sqlQuery);
            return queryResult.rows.map((row: any) => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        }
        finally {
            await dbClient.end();
        }
    }

    async getDramasByChannel(channel: string): Promise<Drama[]> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("drama", "getDramasByChannel", { channel }, format);
            const queryResult = await dbClient.query(sqlQuery);
            return queryResult.rows.map((row: any) => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        }
        finally {
            await dbClient.end();
        }
    }

    async getDramasWithoutAirDate(): Promise<Drama[]> {
        const dbClient = await setConnection();
        try {
            const sqlQuery = mybatisMapper.getStatement("drama", "getDramasWithoutAirDate", {}, format);
            const queryResult = await dbClient.query(sqlQuery);
            return queryResult.rows.map((row: any) => new Drama(row.drm_code, row.drm_name, row.drm_prd, row.drm_brd, row.drm_opdate));
        }
        catch (error) {
            console.error("Error executing query", (error as Error).stack);
            return [];
        }
        finally {
            await dbClient.end();
        }
    }
}
