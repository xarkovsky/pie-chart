/*
 * 2018 - Ruslan Krupinov.
 * e-mail: welcome@krupinov.com
 *
 */


// U. UTILS functions.
function O(obj) 
{ 
	return ( typeof obj == 'object' 
             ? obj 
	         : document.getElementById(obj)
	       ); 
}

function log (message)
{
	console.log( message );
}


// A. CONSRUCTOR PieChart
function PieChart( form, radius, canvas)
{
	this.form = form ;

	// A. INITIALIZATION DATA BASE.
	// A. Инициализируем Базу данных.
	this.initDataBase = function ()
	{
		this.inputs  = form.querySelectorAll('input' );
		this.outputs = form.querySelectorAll('output');
		this.labels  = form.querySelectorAll('label');

		// А1. CHECK THE NUMBER  PARAMETERS
		// А1. Количество тегов input, output & label должно совпадать 
		this.isCorrectForm = function ()
		{	
			if ( (this.inputs.length != this.outputs.length) || (this.inputs.length != this.labels.length)   )
			{
				alert ( " alert ( 'Number of INPUT != OUTPUT'); ");
				return false
			}

		}

		// A2. DATABASE Create function.
		this.createDataBase = function ( )
			{
				this.dataBase = [];
				for (var i = 0; i < this.inputs.length; i++) {
					this.dataBase[i] = {};
				}
			}

		// А3. LEGEND of PieChart function.
		this.getCountryName = function ()
		{
			for ( i = 0; i < this.labels.length; i++ )
			{
				this.dataBase[i].countryName = this.labels[i].innerText;
			}


		}

		// A4. DATA from value attribute function
		this.getValueFromInputs = function ()
		{
			for ( i = 0; i < this.inputs.length; i++ )
			{
				this.dataBase[i].dataValue = parseInt ( this.inputs[i].value);
			}
		}

		this.outputValueOfData = function ()
		{	
			var inputs  = form.querySelectorAll('input' );
			var outputs = form.querySelectorAll('output');
			var len     = inputs.length ;

			for (var i = 0; i < len; i++)
			{
				outputs[i].value = inputs[i].value;
			}
		}

		this.isCorrectForm();
		this.createDataBase();
		this.getCountryName();
		this.getValueFromInputs();
		this.outputValueOfData();

	}

	// B. DATA from value attribute
	this.getValueFromInputs = function ()
	{
		for ( i = 0; i < this.inputs.length; i++ )
		{
			this.dataBase[i].dataValue = parseInt( this.inputs[i].value);
		}
	}

	this.outputValueOfData = function ()
	{	
		var inputs  = form.querySelectorAll('input' );
		var outputs = form.querySelectorAll('output');

		var len = inputs.length ;
		for (var i = 0; i < len; i++)
		{
			outputs[i].value = inputs[i].value;
		}
	}

	// C. INITIALISATION of DataBase
	this.initDataBase();
	
	// D. INITIALISATION Canvas
	this.initCanvas = function () 
	{
		//VARIABLE for draw

		// GET CONTEXT
		this.canvas  = canvas;
		this.context = this.canvas.getContext('2d');

		// SIZES
		this.cX 			   = this.canvas.width / 2;
		this.cY 			   = this.canvas.height / 2;
		this.radius 		   = radius;
		this.context.lineWidth = 0.5;

		// FONTS
		this.context.font = '22px Times New Roman';

		// COLORS 
		this.startColorHSLA = [ 360,  100,  50, 1 ];
		this.endColorHSLA   = [   1,  100,  50, 1 ];
		this.shadowOffset 	= 7;
	}


	this.preparationOfData = function ()
	{
		// VARIABLE
		var dataTotal  = 0; // переменная для хранения суммы всех входных данных
		var angleStart = 0;
		var angleStop  = 0;
		var MARGIN 	   = 7;

		/*Считаем общую сумму данных. Она нам необхдима,
		чтобы вычислять каждую долю*/
		this.calculateTotalData = function ()
		{
			for ( var i = 0, len = this.dataBase.length; i < len; i++ )
			{
				dataTotal += this.dataBase[i].dataValue;		
			}

			this.dataBaseTotal = dataTotal;
		}

		this.setColor = () =>//function ()
		{
			for ( var i = 0; i < this.dataBase.length; i++)
			{
				var h = Math.round(this.startColorHSLA[0] - ((this.startColorHSLA[0]
				  - this.endColorHSLA[0]) / (this.dataBase.length  ) * i) );
				
				var fillColor   = 'hsl(' + h + ',' + 100 + '%,' + 50 +'%)';
				var strokeColor = 'hsl(' + h + ',' +  60 + '%,' + 50 +'%)';

				this.dataBase[i].fillColor   = fillColor;
				this.dataBase[i].strokeColor = strokeColor;
			}
		}

		this.setAngle = function ()
		{
			var dataSubTotal = 0;

			for ( var i = 0; i < this.dataBase.length; i++)
			{
			
			var angleStart = dataSubTotal / this.dataBaseTotal * ( 2 * Math.PI );
			var angleStop  = (dataSubTotal + this.dataBase[i].dataValue) / this.dataBaseTotal * ( 2 * Math.PI );

			this.dataBase[i].angleStart = angleStart;
			this.dataBase[i].angleStop  = angleStop;

			dataSubTotal += this.dataBase[i].dataValue;
			}
		}

		this.setPositionCountryName = function ()
		{
			for ( var i = 0; i < this.dataBase.length; i++)
			{
				var angleStart = this.dataBase[i].angleStart.toFixed(2);
				var textAlign;
				var xPosText;
				var yPosText;

				if (angleStart < 1.57 || angleStart > 4.71 )
				{ 	
					textAlign = 'start';
					this.dataBase[i].textAlign = textAlign;

					xPosText = this.cX + Math.cos(angleStart) * (this.radius + MARGIN);
					yPosText = this.cY + Math.sin(angleStart) * (this.radius + MARGIN*3 )

					this.dataBase[i].xPosText = xPosText;
					this.dataBase[i].yPosText = yPosText;

					// здесь желательно добавить условие 
					// для горизонтального выравнивания текста
					
				} 
				else 
				{
					textAlign = 'end';
					this.dataBase[i].textAlign = textAlign;
					
					xPosText = this.cX + Math.cos(angleStart) * (this.radius + MARGIN );
					yPosText = this.cY + Math.sin(angleStart) * (this.radius + MARGIN );

					this.dataBase[i].xPosText = xPosText;
					this.dataBase[i].yPosText = yPosText;
					
				}
			}

		}


		this.calculateTotalData();
		this.setColor();
		this.setAngle();
		this.setPositionCountryName();
	}

	// E. INITIALIZE start state
	// E. Инициализируем начальное состояние
	this.initCanvas();
	this.preparationOfData();
	this.draw();

	// Метод update() будет вызывать form-a  
	// через addEventListener(). Соответственно 
	// в функцию обработчик будет передаваться this,
	// указывающий на Объект form, а у нас в методах
	// this указывает на Объект PieChart. Поэтому, чтобы 
	// код работал корректно я делаю ссылку на этот Объект

	// Let event handlers access this object
	var chart = this;
	this.update = function ()
	{
		log( this );
		
		chart.getValueFromInputs();
		chart.outputValueOfData();
		chart.preparationOfData()
		chart.draw();
	};

}

// F. SHADOW Draw
// F.1 SHADOW right-bottom
PieChart.prototype.drawChartShadow = function ( offsetX, offsetY, blur, alfa)
{
	this.context.save();
	var cX 		= this.cX;
	var cY 		= this.cY;
	var radius 	= this.radius;
	var alfa 	= alfa    || 0.35;
	var offsetX = offsetX || 7;
	var offsetY = offsetY || 7;
	var blur 	= blur 	  || 25;

	this.context.fillStyle 		= 'rgba(255, 255, 255, ' + alfa + ')';
	this.context.shadowColor 	= "black";
	this.context.shadowOffsetX	= offsetX;
	this.context.shadowOffsetY	= offsetY;
	this.context.shadowBlur 	= blur;

	this.context.beginPath();
	this.context.moveTo( cX, cY );
	this.context.arc( cX, cY, radius, 0, 2*Math.PI, false)
	this.context.closePath();
	this.context.fill();

	this.context.restore();
}

PieChart.prototype.drawDiagram = function ()
{
	this.context.save();

	// Начинаем рисовать диаграмму
	// DRAW diagram
	for ( var i = 0; i < this.dataBase.length; i++)
	{	

		this.context.fillStyle   = this.dataBase[i].fillColor;
		this.context.strokeStyle = this.dataBase[i].strokeColor;
		
		this.context.beginPath();
		this.context.moveTo( this.cX, this.cY);

		var angleStart = this.dataBase[i].angleStart;
		var angleStop  = this.dataBase[i].angleStop;

		if ( angleStart == angleStop) continue ; // нет данных - нечего рисовать

		this.context.arc(this.cX, this.cY, this.radius, angleStart, angleStop, false );


		this.context.textAlign = this.dataBase[i].textAlign;
		this.context.fillText( this.dataBase[i].countryName ,
							   this.dataBase[i].xPosText    ,
							   this.dataBase[i].yPosText      );

		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}

	this.context.restore();
}

// G. DRAW ALL PieChart function.
PieChart.prototype.draw = function ()
{	
	this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height);
	this.context.save();

	this.drawChartShadow();
	this.drawChartShadow( -17, -7, 82 , 0.35);
	this.drawDiagram();

	this.context.restore();

} // END -- DRAW PieChart function



// H. GET DOM-elements 
var formN1   = O('form-1');
var canvasN1 = O('chart');
var radius   = 160;

var pieChartN1   = new PieChart( formN1, radius, canvasN1 );

formN1.addEventListener( 'input', pieChartN1.update, false);

	
