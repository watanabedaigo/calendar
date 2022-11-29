// 本番ではjsonでデータを取得後配列に変換
const dateArg = [
  26,
  27,
  28,
  29,
  30,
  31,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  1,
  2,
  3,
  4,
  5
];

// 当月分の配列を作成
const firstArg = new Array();
let first;
first = dateArg.indexOf(1);
while (first !== -1) {
  firstArg.push(first);
  first = dateArg.indexOf(1, first + 1);
}
const thisMonthFirst = firstArg[0];
const nextMonthFirst = firstArg[1];
const thisMonth = dateArg.slice(thisMonthFirst, nextMonthFirst);

// 予定追加イベント
const formDate01 = document.getElementById("form__date01");
let date01;
let startDate;
const formDate02 = document.getElementById("form__date02");
const formTime01 = document.getElementById("form__time01");
const formContents01 = document.getElementById("form__contents01");
const formBtn01 = document.getElementById("form__btn01");
const modal = document.getElementsByClassName("calendar--table__modal")[0];
let scheduleNum = 0;

// - 開始日を入力したら動的に終了日を追加
formDate01.addEventListener("change", () => {
  date01 = formDate01.value.slice(0, -1);
  startDate = thisMonth.indexOf(Number(date01) + 1);
  const endDateArg = thisMonth.slice(startDate);
  formDate02.innerHTML = "";
  for (let i = 0; i < endDateArg.length; i++) {
    const endDate = i + startDate + "日";
    const optionEnd = document.createElement("option");
    optionEnd.setAttribute("value", endDate);
    optionEnd.innerHTML = endDate;
    formDate02.appendChild(optionEnd);
  }
});

// - クリック時に予定を追加
formBtn01.addEventListener("click", () => {
  date01 = formDate01.value.slice(0, -1);
  const date02 = formDate02.value.slice(0, -1);
  const time01 = formTime01.value;
  const contents01 = formContents01.value;
  const targetArea = document
    .getElementsByClassName("area" + (thisMonthFirst + Number(date01)))[0]
    .getElementsByClassName("calendar--table__contents")[0];
  const targetAreaTop = targetArea.getElementsByClassName("area--top")[0];
  const targetAreaMiddle = targetArea.getElementsByClassName("area--middle")[0];
  const targetAreaBottom = targetArea.getElementsByClassName("area--bottom")[0];
  const schedule = document.createElement("p");

  // 日付をまたがない予定追加
  if (date01 == date02) {
    scheduleNum += 1;
    schedule.className = [
      `schedule--${scheduleNum}`,
      "calendar--table__schedule"
    ].join(" ");
    schedule.innerHTML = `
        <span class="calendar--table__schedule__time">${time01}</span>${contents01}
        <span class="calendar--table__schedule__btn"></span>
      `;

    // - 上から順に追加
    if (targetAreaTop.innerHTML == "") {
      targetAreaTop.appendChild(schedule);
    } else if (targetAreaMiddle.innerHTML == "") {
      targetAreaMiddle.appendChild(schedule);
    } else if (targetAreaBottom.innerHTML == "") {
      targetAreaBottom.appendChild(schedule);
    } else {
      targetArea.appendChild(schedule);
    }
  } else {
    // 日付をまたぐ予定追加
    const selectedDates = thisMonth.slice(date01 - 1, date02);
    const scheduleNumArg = [];
    let selectedTargetArea;
    let selectedTargetAreaTop;
    let selectedTargetAreaMiddle;
    let selectedTargetAreaBottom;
    let schedule02;
    selectedDates.forEach(function (selecteddate) {
      selectedTargetArea = document
        .getElementsByClassName(
          "area" + (thisMonthFirst + Number(selecteddate))
        )[0]
        .getElementsByClassName("calendar--table__contents")[0];
      selectedTargetAreaTop = selectedTargetArea.getElementsByClassName(
        "area--top"
      )[0];
      selectedTargetAreaMiddle = selectedTargetArea.getElementsByClassName(
        "area--middle"
      )[0];
      selectedTargetAreaBottom = selectedTargetArea.getElementsByClassName(
        "area--bottom"
      )[0];
      schedule.innerHTML = `
          <span>${date01}~${date02}</span>${contents01}
          <span class="calendar--table__schedule__btn"></span>
        `;
      schedule02 = schedule.cloneNode(true);
      schedule02.className = [
        `date--${date01}-${date02}`,
        "calendar--table__schedule",
        "calendar--table__schedule--long"
      ].join(" ");
      schedule02.innerHTML = `
          <span>${date01}~${date02}</span>${contents01}
          <span class="calendar--table__schedule__btn"></span>
          `;

      // - 選択中の日付によって特定のクラスを付与
      if (selecteddate === Number(date01)) {
        schedule02.classList.add(
          "schedule--first",
          "calendar--table__schedule--long"
        );
      } else if (selecteddate === Number(date02)) {
        schedule02.classList.add("schedule--last");
        schedule02.style.color = "transparent";
      } else {
        schedule02.classList.add("schedule--middle");
        schedule02.style.color = "transparent";
      }

      // - 選択中の日付の予定数に応じて特定の値を配列に追加
      if (selectedTargetAreaTop.innerHTML == "") {
        scheduleNumArg.push(0);
      } else if (
        selectedTargetAreaTop.innerHTML !== "" &&
        selectedTargetAreaMiddle.innerHTML == ""
      ) {
        scheduleNumArg.push(1);
      } else if (
        selectedTargetAreaTop.innerHTML !== "" &&
        selectedTargetAreaMiddle.innerHTML !== "" &&
        selectedTargetAreaBottom.innerHTML == ""
      ) {
        scheduleNumArg.push(2);
      } else if (
        selectedTargetAreaTop.innerHTML !== "" &&
        selectedTargetAreaMiddle.innerHTML !== "" &&
        selectedTargetAreaBottom.innerHTML !== ""
      ) {
        scheduleNumArg.push(3);
      }

      // - 選択中の日付の予定数を格納している配列の中身によって以下位置を変更
      if (
        scheduleNumArg.indexOf(0) !== -1 &&
        scheduleNumArg.indexOf(1) == -1 &&
        scheduleNumArg.indexOf(2) == -1
      ) {
        selectedTargetAreaTop.appendChild(schedule02);
      } else if (
        scheduleNumArg.indexOf(1) !== -1 &&
        scheduleNumArg.indexOf(2) == -1
      ) {
        selectedTargetAreaMiddle.appendChild(schedule02);
      } else if (scheduleNumArg.indexOf(2) !== -1) {
        selectedTargetAreaBottom.appendChild(schedule02);
      } else {
        selectedTargetArea.appendChild(schedule02);
      }
    });
  }

  // - 予定が4つ以上ある場合に＋(非表示分)を表示
  const areaChildrenNum = targetArea.children.length;
  if (areaChildrenNum > 3) {
    const moreNum = areaChildrenNum - 3;
    const more = targetArea.parentNode.querySelectorAll(".txt--more")[0];
    more.innerHTML = `
        +<span>${moreNum}</span>
      `;
  }

  // - 予定追加後モーダル非表示
  modal.classList.remove("is-open");
});

// モーダルの中身を動的に追加、表示
const areas = Array.prototype.slice.call(
  document.getElementsByClassName("area")
);
areas.forEach(function (area) {
  area.addEventListener("click", (e) => {
    modal.classList.add("is-open");

    // - モーダル内日付追加、表示
    const modalDate = modal.querySelectorAll(".modal__date")[0];
    const clickDate = e.target.querySelectorAll(".calendar--table__date")[0]
      .innerHTML;
    modalDate.textContent = `${clickDate}日`;

    // - モーダル内コンテンツ追加、表示
    const modalcontents = modal.querySelectorAll(".modal__contents")[0];
    modalcontents.innerHTML = "";
    const clickContents = Array.prototype.slice.call(
      e.target.querySelectorAll(".calendar--table__schedule")
    );
    clickContents.forEach(function (clickContent) {
      modalcontents.appendChild(clickContent.cloneNode(true));
    });

    // - コンテンツ削除
    if (clickContents.length > 0) {
      const deleteBtns = Array.prototype.slice.call(
        modalcontents.getElementsByClassName("calendar--table__schedule__btn")
      );
      deleteBtns.forEach(function (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          // - モーダル内のコンテンツ削除
          deleteBtn.parentNode.remove();

          // - カレンダー内のコンテンツ削除
          const calendarTable = document.getElementsByClassName(
            "calendar--table"
          )[0];
          const deleteClass = deleteBtn.parentNode.className
            .split(" ")
            .slice(0, 1)[0];

          // -- 日をまたがない場合
          const deleteTarget = calendarTable.getElementsByClassName(
            deleteClass
          )[0];
          deleteTarget.remove();

          // -- 日をまたぐ場合
          const deleteTargets02 = Array.prototype.slice.call(
            calendarTable.getElementsByClassName(deleteClass)
          );
          deleteTargets02.forEach(function (deleteTarget02) {
            deleteTarget02.remove();
          });
        });
      });
    }
  });
});

// モーダル非表示
const modalBtn = document.getElementsByClassName("modal__btn")[0];
modalBtn.addEventListener("click", () => {
  modal.classList.remove("is-open");
});

// 動的に日付挿入
for (let i = 0; i < dateArg.length; i++) {
  const date = dateArg[i];
  const targetNum = i + 1;
  const targetDiv = document.getElementsByClassName("area" + targetNum)[0];
  const target = targetDiv.firstElementChild;
  target.textContent = date;
}

// 6行目が不要な場合削除
if (dateArg.length < 36) {
  const hiddenArea = document.querySelectorAll(".hidden");
  hiddenArea.forEach(function (area) {
    area.style.display = "none";
  });
}

// 当月分の全日付をselectの選択肢として追加
for (let i = 0; i < thisMonth.length; i++) {
  const optionDate = i + 1 + "日";
  const option = document.createElement("option");
  option.setAttribute("value", optionDate);
  option.innerHTML = optionDate;
  formDate01.appendChild(option);
}

// 当月か否かで背景色変える
for (let i = 0; i < thisMonthFirst; i++) {
  const prevNum = i + 1;
  const prev = document.getElementsByClassName("area" + prevNum)[0];
  if (prev) {
    prev.style.backgroundColor = "#F1F1F1";
  }
}
for (let i = 0; i < nextMonthFirst; i++) {
  const nextNum = i + 1 + nextMonthFirst;
  const next = document.getElementsByClassName("area" + nextNum)[0];
  if (next) {
    next.style.backgroundColor = "#F1F1F1";
  }
}
