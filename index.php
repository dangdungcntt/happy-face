<!DOCTYPE html>
<html lang="vn">
<head>
	<title>Happy face</title>
	<link rel="stylesheet" href="css/happy-face.css">	
</head>
<body>
	<div class="container" id="app">
		<div class="box-game">
			<div class="game-content clearfix">
				<div v-for="(num, index) in nBox" v-bind:class="cl">
					<img v-bind:src="getImage(index)" v-on:click="check(index, $event)" v-el:faceItem>
				</div>
			</div>
			<div id="game-time-out" class="process-bar"></div>
			<div id="gameover" class="endGame">
				<p><img src="img/gameover.png" alt="Game over"></p>
				<a><img src="img/replay.png" alt="Play again" v-on:click="playAgain"></a>
			</div>
			<div id="win" class="endGame">
				<p><img src="img/win.png" alt="Win"></p>
				<a><img src="img/replay.png" alt="Play again" v-on:click="playAgain"></a>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="vendor/vue.min.js"></script>
	<script type="text/javascript" src="js/happy-face.js"></script>
</body>
</html>