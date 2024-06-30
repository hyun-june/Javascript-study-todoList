// 유저가 값을 입력한다
// + 버튼을 클릭하면, 할일이 추가된다.
// delete 버튼을 누르면 할일이 삭제된다.
// check 버튼을 누르면 할일이 끝나고, 밑줄이 생긴다.
// 1. check 버튼을 클릭하면 isComplete 값이 false => true
// 2. true = 끝난 걸로 간주하고 밑줄
// 3. false = 안 끝난 상태
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남 탭은, 끝난 아이템만, 진행중은 진행중인 아이템만 표시된다.
// 전체 탭은 다시 전체 아이템을 보여준다.

let displayUnderLine = document.getElementById("display-underline");
let displayTabs = document.querySelectorAll('.display-tabs div');
let memoDate = document.getElementById("memo-date");
let memoContent = document.getElementById("memo-content");
let memoAddButton = document.getElementById("memo-add-button");
let memoList = [];
let filterList = [];
let mode = "all";


const render = () =>{
    let resultHTML = '';
    let list = [];

    if(mode === "all"){
        list = memoList;
    } else if(mode === "ongoing" || mode === "done"){
        list = filterList;
    }

    for(let i=0;i<list.length;i++){
        if(list[i].status){
            resultHTML += `
        <div class="display-task  task-line">
            <div class="display-task-content">
              <div>${list[i].date}</div>
              <div>${list[i].content}</div>
            </div>
            <div class="display-button-zone">
                <button class="display-button" onclick="checkMemo('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="display-button" onclick="deleteMemo('${list[i].id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`
        } else{
            resultHTML += `
            <div class="display-task">
                <div class="display-task-content">
                  <div>${list[i].date}</div>
                  <div>${list[i].content}</div>
                </div>
                <div class="display-button-zone">
                    <button class="display-button" onclick="checkMemo('${list[i].id}')"><i class="fa-solid fa-check"></i></button>
                    <button class="display-button" onclick="deleteMemo('${list[i].id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`
        }
    }
    document.getElementById("display-board").innerHTML = resultHTML;
}

const addMemo = () =>{
    let date = memoDate.value.trim();
    let content = memoContent.value.trim();

    if(date || content){
        let memoContents = {id: newID(), date : date, content : content, status:false}
        memoList.push(memoContents)
        render();
        memoDate.value = "";
        memoContent.value = "";
    } else{
        alert("내용을 입력해주세요.")
    }

}

memoAddButton.addEventListener("click",addMemo);
document.addEventListener("keypress", (event)=> {
    if (event.key === "Enter") {
        let modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
        if (modal && modal._isShown) {
            event.preventDefault(); 

            if (document.activeElement.id === "memo-date" || document.activeElement.id === "memo-content") {
                addMemo();
                modal.hide();
            }
        } else {
            document.getElementById("add-button").click();
        }
    }
});

document.getElementById("memo-cancle-button").addEventListener("click", () => {
    memoDate.value = "";
    memoContent.value = "";
});

const checkMemo = (id)=>{
    for(let i=0; i<memoList.length; i++){
        if(memoList[i].id == id){
            memoList[i].status = !memoList[i].status;
            break;
        }
    }
    filter();
}

const deleteMemo = (id) =>{
    for(let i=0; i<memoList.length; i++){
        if(memoList[i].id == id){
            memoList.splice(i,1);
            break;
        }
    }
    filter();
}


const filter = (e) =>{
    
    if(e){
    mode = e.target.id;
    displayUnderLine.style.left = e.currentTarget.offsetLeft + "px";
    displayUnderLine.style.width = e.currentTarget.offsetWidth + "px";
    displayUnderLine.style.top = (e.currentTarget.offsetTop + e.currentTarget.offsetHeight -4)  + "px";
    }

    filterList = [];
    if(mode === "all"){
        render();
    } else if (mode === "ongoing"){
        for(let i=0; i<memoList.length;i++){
            if(memoList[i].status === false){
                filterList.push(memoList[i])
            } 
        } render();
    } else if (mode === "done"){
        for(let i=0; i<memoList.length;i++){
            if(memoList[i].status === true){
                filterList.push(memoList[i])
            } 
        } render();
    }
}

document.addEventListener("DOMContentLoaded", ()=> {
    const startLine = displayTabs[1];
    displayUnderLine.style.left = startLine.offsetLeft + "px";
    displayUnderLine.style.width = startLine.offsetWidth + "px";
    displayUnderLine.style.top = (startLine.offsetTop + startLine.offsetHeight - 4) + "px";
});

displayTabs.forEach((tabs)=>tabs.addEventListener("click",(e)=>filter(e)));


let newID = () =>{
    return Math.random().toString(36).substr(2, 8);
}