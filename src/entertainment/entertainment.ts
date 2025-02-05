export class Department {
    constructor(
        public dept_code?: string,
        public dept_name?: string,
        public dept_loc?: string
    ) {}
}

export class Employee {
    constructor(
        public emp_code?: string,
        public emp_name?: string,
        public emp_mgt?: string,
        public emp_sal?: number
    ) {}
}

export class Drama {
    constructor(
        public drm_code?: string,
        public drm_name?: string,
        public drm_prd?: string,
        public drm_brd?: string,
        public drm_opdate?: string
    ) {}
}
