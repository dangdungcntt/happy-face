var listStage = [
	{ stage: 0, time: 2000, nBox: 4, cl: 'hv hv-2'},
	{ stage: 1, time: 1600, nBox: 4, cl: 'hv hv-2'},
	{ stage: 2, time: 1200, nBox: 4, cl: 'hv hv-2'},
	{ stage: 3, time: 2500, nBox: 9, cl: 'hv hv-3'},
	{ stage: 4, time: 2100, nBox: 9, cl: 'hv hv-3'},
	{ stage: 5, time: 1700, nBox: 9, cl: 'hv hv-3'},
	{ stage: 6, time: 3250, nBox: 16, cl: 'hv hv-4'},
	{ stage: 7, time: 3000, nBox: 16, cl: 'hv hv-4'},
	{ stage: 8, time: 2750, nBox: 16, cl: 'hv hv-4'},
	{ stage: 9, time: 2500, nBox: 16, cl: 'hv hv-4'},
	{ stage: 10, time: 4000, nBox: 25, cl: 'hv hv-5'},
	{ stage: 11, time: 3700, nBox: 25, cl: 'hv hv-5'},
	{ stage: 12, time: 3400, nBox: 25, cl: 'hv hv-5'},
	{ stage: 13, time: 3100, nBox: 25, cl: 'hv hv-5'},
	{ stage: 14, time: 2800, nBox: 25, cl: 'hv hv-5'},
	{ stage: 15, time: 4500, nBox: 36, cl: 'hv hv-6'},
	{ stage: 16, time: 4250, nBox: 36, cl: 'hv hv-6'},
	{ stage: 16, time: 4000, nBox: 36, cl: 'hv hv-6'},
	{ stage: 17, time: 5000, nBox: 49, cl: 'hv hv-7'},
	{ stage: 18, time: 4500, nBox: 49, cl: 'hv hv-7'},
	{ stage: 19, time: 5250, nBox: 64, cl: 'hv hv-8'},
],
listHappy = [
	'img/happy/angela_happy.png',
	'img/happy/ben_happy.png',
	'img/happy/ginger_happy.png',
	'img/happy/vet_happy.png',
],
listNeutral = [
	'img/neutral/angela_neutral.png',
	'img/neutral/ben_neutral.png',
	'img/neutral/ginger_neutral.png',
	'img/neutral/vet_neutral.png',
];
var best = localStorage.getItem('best_score') || 0;
var app = new Vue({
	el: "#app" ,
	data: {
		best,
		cl: '',
		nBox: 0,
		listStage,
		listHappy,
		listNeutral,
		correctIndex: 0,
		currentStage: 0,
	},
	created() {
		this.faceLength = this.listNeutral.length;	//số mặt cười, không cười
		this.update(this.listStage[0]);
		clearInterval(this.itvTimeout);
		document.getElementById('welcome').style.display = 'block';
	},
	methods: {
		update({stage, time, nBox, cl}) {
			let rd = this.random(nBox); //random ô kết quả
			while (rd == this.correctIndex) { //random đến khi nào ra ô khác ô ở màn chơi trước
				rd = this.random(nBox);
			}
			this.cl = cl;				//class
			this.nBox = nBox;			//số ô
			this.correctIndex = rd;		//ô kết quả
			this.currentStage = stage;	//màn chơi
			this.countDown('game-time-out', time);	//đếm ngược thời gian
		},
		getImage(index) { //lấy hình ảnh
			const {
				correctIndex, getHappy, getNeutral
			} = this;
			if (index == correctIndex){ //nếu là ô kết quả
				return getHappy();	
			}
			return getNeutral();
		},
		getNeutral() { //trả về 1 mặt không cười
			const {
				listNeutral, random, faceLength
			} = this;
			return listNeutral[random(faceLength)];
		},
		getHappy() {	//trả về 1 mặt cười
			const {
				listHappy, random, faceLength
			} = this;
			return listHappy[random(faceLength)];
		},
		random(max, min = 0) { //trả về một số ngầu nhiên từ min -> max
			return Math.floor(Math.random() * max + min);
		},
		check(index, event) {
			// console.log('click %d', index);
			let {
				correctIndex, currentStage,
				listStage, update, victory, gameOver
			} = this;
			if (index === correctIndex) {
				clearInterval(this.itvTimeout);
				if (currentStage === listStage.length - 1) //Đến màn cuối
					return victory();				//show màn hình chiến thắng

				event.target.style.background = '#0af55b'; //set màu nền xanh báo hiệu chọn đúng
				setTimeout(() => {
					event.target.style.background = 'white'; //set trả lại nền trắng để chơi màn tiếp theo
					update(listStage[++currentStage]);	//cập nhật cho màn chơi tiếp theo
				}, 50);
				return;
			}
			gameOver(event.target);
		},
		saveBest() {
			this.best = this.best > this.currentStage ? this.best : this.currentStage;
			localStorage.setItem('best_score', this.best);
		},
		victory() { //thắng
			this.saveBest();
			document.getElementById('win').style.display = 'block';	//show màn hình chiến thắng
		},
		gameOver(elTarget) { //thua
			this.saveBest();
			clearInterval(this.itvTimeout);							//xóa đếm ngược thời gian
			this.flicker(elTarget);									//nhấp nháy ô chọn sai hoặc là thanh thời gian
			document.getElementById('gameover').style.display = 'block';	//show màn hình thua
			document.querySelectorAll('.hv img')[this.correctIndex].style.background = '#0af55b'; //tô xanh ô kết quả
		},
		playAgain() { //chơi lại
			document.getElementById('win').style.display = 'none'; //ẩn màn hình thắng
			document.getElementById('gameover').style.display = 'none'; //ẩn màn hình thua
			document.getElementById('welcome').style.display = 'none';
			//trả lại màu trắng cho ô kết quả vừa mới được tô xanh
			document.querySelectorAll('.hv img')[this.correctIndex].style.background = 'white'; 
			//trả lại màu trắng cho ô chọn sai vừa đc tô đỏ
			if (this.redItem) this.redItem.style.background = 'white';	
			//cập nhật cho màn chơi tiếp theo
			this.update(this.listStage[0]);
		},
		flicker(elTarget) { //nhấp nháy đỏ
			//cho width 100 vì hàm dùng cho cả thanh thời gian (khi thua thì thanh thời gian width = 0)
			elTarget.style.width = '100%'; 
			elTarget.style.background = 'red';
			setTimeout(() => elTarget.style.background = 'white', 100);
			setTimeout(() => elTarget.style.background = 'red', 200);
			setTimeout(() => elTarget.style.background = 'white', 300);
			setTimeout(() => {
				elTarget.style.background = 'red';
				this.redItem = elTarget; //lưu ô đang màu đỏ lại để khi bấm play again ta tô trắng
			}, 400);
		},
		countDown(elId, time) { //đếm ngược thời gian
			time += 50; //bù lại 50ms do ta delay 50ms để hiển thị màu xanh chọn đúng
			clearInterval(this.itvTimeout); //xóa đếm ngược lần trước
			let elem = document.getElementById(elId); //lấy ra thanh thời gian
			let width = 100; //đầy thanh thời gian
			const frame = () => { //hàm được gọi mỗi 10ms
				if (width <= 0) { //hết thời gian
					elem.style.width = '0%'; //set 0% tránh trường hợp bị dư 1 chút xíu
					this.gameOver(elem); //thua
				} else {
					width -= 100 / (time / 10); //giảm width xuống để thấy thanh thời gian giảm 
					elem.style.width = width + '%'; //set width
				}
				//màu nền thay đổi theo thời gian con lại
				var background;
				if (width < 20) background = '#fe3a27';
				else if (width < 40) background = '#ffaa16';
				else if (width < 55) background = '#ffff0a';
				else background = '#02e16c';
				elem.style.background = background;
			}
			this.itvTimeout = setInterval(frame, 10); //cập nhật thanh thời gian mỗi 10ms
		}
	}
});