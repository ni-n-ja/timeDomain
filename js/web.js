'use strict'

var canvas;
var context;
var x, y;
var ratio;
var fftSize = 1024;
var audioContext = new AudioContext();
var AnaliserNode = audioContext.createAnalyser();
AnaliserNode.fftSize = fftSize;
var bufferLength = AnaliserNode.frequencyBinCount;
var frequency = new Uint8Array(bufferLength);
var AnaliserNode2 = audioContext.createAnalyser();
AnaliserNode2.fftSize = fftSize;
var bufferLength2 = AnaliserNode2.frequencyBinCount;
var frequency2 = new Uint8Array(bufferLength2);
console.log("reloded");

$(document).ready(function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    navigator.getMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    navigator.getMedia({
        audio: true
    }, function (stream) {
        audioContext.destination.channelCount = 2;
        var source = audioContext.createMediaStreamSource(stream);
        var oscillator5000 = audioContext.createOscillator();
        var oscillator10000 = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        var splitterR = audioContext.createChannelSplitter(2);
        var splitterL = audioContext.createChannelSplitter(2);
        var merger = audioContext.createChannelMerger(2);

        oscillator5000.type = 'sine';
        oscillator5000.frequency.value = 1000;
        oscillator10000.type = 'sine';
        oscillator10000.frequency.value = 5000;

        gainNode.gain.value = 1;

        oscillator5000.connect(splitterL);
        oscillator10000.connect(splitterR);
        splitterR.connect(merger, 0, 0);
        splitterL.connect(merger, 0, 1);
        merger.connect(gainNode);
        //oscillator.connect(gainNode);
        gainNode.connect(AnaliserNode);
        AnaliserNode.connect(audioContext.destination);
        source.connect(AnaliserNode2);
        oscillator5000.start();
        oscillator10000.start();
    }, function (err) { });
    requestAnimationFrame(animate);

});

function animate(timestamp) {
    context.clearRect(0,0,600,480);
//    AnaliserNode.getByteFrequencyData(frequency);
    AnaliserNode2.getByteTimeDomainData(frequency);
    for (var i = 0; i < 512; i++) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, frequency[i]);
        context.stroke();
    }
    requestAnimationFrame(animate);
}

$(document).click(function (e) {
    console.log("clicked");
});