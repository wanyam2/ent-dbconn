import readline from 'readline';
import { PostgresDepartmentService } from "./entertainment/postgres-entertainment-service";

const postgresService = new PostgresDepartmentService();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const executeQuiz = async (quizNumber: number) => {
    try {
        switch (quizNumber) {
            case 1:
                console.log("Quiz01: HNU Entertainment의 부서 코드, 이름, 위치를 검색");
                console.log(await postgresService.getDepartments());
                break;

            case 2:
                console.log("Quiz02: 연예관계자 코드, 이름, 관리자, 급여를 검색");
                console.log(await postgresService.getEmployees());
                break;

            case 3:
                console.log("Quiz03: HNU Entertainment에서 제작한 드라마의 코드와 이름을 검색");
                console.log(await postgresService.getDramasByProducer("HNU-E"));
                break;

            case 4:
                console.log("Quiz04: 드라마 방영사가 KBC이거나 SBC인 드라마를 검색");
                console.log(await postgresService.getDramasByNetwork(["KBC", "SBC"]));
                break;

            case 5:
                console.log("Quiz05: 드라마 제작사를 검색 (중복 제거)");
                console.log(await postgresService.getUniqueProducers());
                break;

            case 6:
                console.log("Quiz06: 연예관계자들의 급여 총합과 평균 급여액 계산");
                console.log(await postgresService.getSalarySummary());
                break;

            case 7:
                console.log("Quiz07: 방영일자가 확정되지 않은 드라마의 이름 검색");
                console.log(await postgresService.getUnconfirmedDramas());
                break;

            case 8:
                console.log("Quiz08: 연예관계자 이름과 직속 상사의 이름 검색");
                console.log(await postgresService.getEmployeesWithManagers());
                break;

            case 9:
                console.log("Quiz09: 이름과 급여 출력 (급여 내림차순, 동일 급여일 경우 이름 오름차순 정렬)");
                console.log(await postgresService.getSortedEmployees());
                break;

            case 10:
                console.log("Quiz10: 직급별 평균 급여액이 5000 이상인 직급의 정보 검색");
                console.log(await postgresService.getSalaryByRole());
                break;

            case 11:
                console.log("Quiz11: 평균 급여액보다 많은 급여를 받는 연예관계자 검색");
                console.log(await postgresService.getHighSalaryEmployees());
                break;

            case 12:
                console.log("Quiz12: 방영일자가 확정되지 않은 드라마의 방영일자 수정");
                await postgresService.updateDramaAirDate();
                console.log("방영일자 수정 완료.");
                break;

            case 13:
                console.log("Quiz13: 김수현 씨 승진 및 급여 인상 처리");
                await postgresService.promoteEmployee("김수현");
                console.log("승진 및 급여 인상 완료.");
                break;

            case 14:
                console.log("Quiz14: 새 임원 등록 (손진현)");
                await postgresService.addExecutive({
                    emp_code: "E903",
                    emp_name: "손진현",
                    salary: 4000
                });
                console.log("임원 등록 완료.");
                break;

            case 15:
                console.log("Quiz15: 손진현 퇴직 처리");
                await postgresService.removeEmployee("손진현");
                console.log("퇴직 처리 완료.");
                break;

            default:
                console.log("잘못된 입력입니다. 1~15 사이의 숫자를 입력해주세요.");
        }
    } catch (error) {
        console.error("Error executing query:", (error as Error).message);
    }
};

// 사용자 입력 받기
rl.question("실행할 퀴즈 번호를 입력하세요 (1~15): ", (input) => {
    const quizNumber = parseInt(input, 10);
    if (isNaN(quizNumber) || quizNumber < 1 || quizNumber > 15) {
        console.log("잘못된 입력입니다. 1~15 사이의 숫자를 입력해주세요.");
        rl.close();
    } else {
        executeQuiz(quizNumber).finally(() => rl.close());
    }
});
