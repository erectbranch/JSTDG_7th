/**
 * 문자열에서 각 문자의 빈도를 찾는 히스토그램 코드(charfreq)
 * 이 프로그램은 표준 입력을 받아 그 텍스트에 각 글자가 나타나는 빈도를 계산한 다음
 * 가장 많이 나타난 글자를 히스토그램으로 표현한다.
 * 이 프로그램을 실행하려면 노드 12 이상이 필요하다.
 *
 * 유닉스 계열 운영 체제에서는 이 프로그램을 아래 코드로 실행 가능하다.
 *    node charfreq.js < corpus.txt
 */

// 이 클래스는 맵을 확장한다. get() 메서드는 키가 맵에 존재하지 않을 때
// null 대신 지정된 값을 반환한다.
class DefaultMap extends Map {
    constructor(defaultValue) {
        super();                          // 슈퍼클래스 생성자를 호출
        this.defaultValue = defaultValue; // 기본 값을 기억
    }

    get(key) {
        if (this.has(key)) {              // 맵에 키가 이미 있다면
            return super.get(key);        // 슈퍼클래스에서 그 값을 가져와 반환한다.
        }
        else {
            return this.defaultValue;     // 그런 키가 없으면 기본 값을 반환한다.
        }
    }
}

// 이 클래스는 글자 빈도 히스토그램을 표시한다.
class Histogram {
    constructor() {
        this.letterCounts = new DefaultMap(0);  // 글자의 등장 횟수를 기록
        this.totalLetters = 0;                  // 전체 글자 수
    }

    // 텍스트를 받아 히스토그램을 업데이트한다.
    add(text) {
        // 텍스트에서 공백을 제거하고 대문자로 변환
        text = text.replace(/\s/g, "").toUpperCase();

        // 텍스트의 글자를 순회
        for(let character of text) {
            let count = this.letterCounts.get(character); // 이전 횟수를 가져온다
            this.letterCounts.set(character, count+1);    // 1을 더한다.
            this.totalLetters++;
        }
    }

    // 히스토그램을 ASCII 그래프로 표현
    toString() {
        // 맵을 [key,value] 배열로 변환한다.
        let entries = [...this.letterCounts];

        // 배열을 횟수, 알파벳순으로 정렬한다.
        entries.sort((a,b) => {              // 정렬 횟수를 정의하는 함수
            if (a[1] === b[1]) {             // 횟수가 같으면
                return a[0] < b[0] ? -1 : 1; // 알파벳순으로 정렬한다.
            } else {                         // 횟수가 다르면
                return b[1] - a[1];          // 큰 겂이 앞으로 온다.
            }
        });

        // 횟수를 퍼센트로 변환한다.
        for(let entry of entries) {
            entry[1] = entry[1] / this.totalLetters*100;
        }

        // 1% 미만의 글자는 버린다.
        entries = entries.filter(entry => entry[1] >= 1);

        // 이제 각 항목을 글자의 나열로 반환한다.
        let lines = entries.map(
            ([l,n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
        );

        // 각 행을 줄바꿈 문자로 구분해 병합한 문자열을 반환한다.
        return lines.join("\n");
    }
}

// 이 비동기(프라미스를 반환하는) 함수를 히스토그램 객체를 만들고,
// 표준 입력에서 텍스트 덩어리들을 비동기적으로 읽어서 그 덩어리를 히스토그램에 추가한다.
// 스트림의 끝에 도달하면 이 히스토그램을 반환한다.
async function histogramFromStdin() {
    process.stdin.setEncoding("utf-8"); // 바이트가 아닌 유니코드 문자열로 읽는다.
    let histogram = new Histogram();
    for await (let chunk of process.stdin) {
        histogram.add(chunk);
    }
    return histogram;
}

// 이 마지막 행이 프로그램의 메인 바디.
// 표준 입력에서 히스토그램 객체를 만들고 히스토그램을 출력한다.
histogramFromStdin().then(histogram => { console.log(histogram.toString()); });
Footer
© 2022 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
