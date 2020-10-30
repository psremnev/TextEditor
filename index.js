class RichEditor extends HTMLElement {
	constructor(data) {
		super()
		this.innerHTML = `
					<div class='toolbar'>
						<div class='bar'>
							<div class='weight'>
								<button>B</button>
								<button>K</button>
								<button>U</button>
								<button>O</button>
							</div>
							<div class='size' style="padding: 3px;">
								Размер <input class='size-input' type= 'range' value="4"  max=7>
							</div>
							<select class='font-family'>
								<option>Arial</option>
								<option>Arial Black</option>
								<option>TimesNewRoman</option>
								<option>Calibri</option>
								<option>Tahoma</option>
								<option>Comic Sans MS</option>
								<option>Courier New</option>
								<option>Franklin Gothic Medium</option>
								<option>Impact</option>
								<option>Verdana</option>
							</select>
							<div style="padding: 3px;">Цвет</div><input class= 'text-color' type='color'/>		
						</div>
						<div class='bar'>
							<div style="padding: 3px;">Цвет фона</div><input class= 'text-back-color' type='color'/>
							<div class='align'>
								<button>Left</button>
								<button>Center</button>
								<button>Right</button>
								<button>Justify</button>
							</div>
							<div class='separator'></div>
							<div class='history'>
								<button>Undo</button>
								<button>Redo</button>
							</div>
						</div>
						<div class='bar'>
							<select class='text-head'>
								<option>H1</option>
								<option>H2</option>
								<option>H3</option>
								<option>H4</option>
								<option>H5</option>
								<option>H6</option>
							</select>
							<button class='text-paragraph'>Абзац<dbutton>
							<button class='text-br'>br</button>
							<button class='text-hr'>hr</button>
							<select class='text-list'>
								<option>Маркированный</option>
								<option>Нумерованный</option>			
							</select>
							<select class='text-index'>
								<option>Нижний индекс</option>
								<option>Верхний индекс</option>			
							</select>
						</div>
						<div class='bar'>
							<button class='image-float-left'>Image Left</button>
							<button class='image-float-center'>Image Center</button>
							<button class='image-float-right'>Image Right</button>
							<button class='text-clear-format'>Clear Format</button>
						</div>
						<div class='bar'>
							<label for="file-upload" class="upload">
								Image Load
							</label>
							<input class='image-upload' type='file' id='file-upload' accept="image/jpeg,image/png,image/gif"/>
							<div class='image-link'>Image Link</div>
							<div class='create-link'>Create Link</div>
						</div>
					</div>
					<div class='text-area' contenteditable="true"></div>
			`
			if(!data) {
				console.error('Необходимо указать ширину и высоту для экземпляра класса')
			}
			
			this.style.maxWidth = data.width + 'px'
			this.editArea = this.querySelector('.text-area')
			this.editArea.style.height = data.height + 'px'
			this.className = 'root-editor'

			this.selectImageId
			this.weight = this.querySelector('.weight')
			this.editArea = this.querySelector('.text-area')
			this.toolbar = this.querySelector('.toolbar')
			this.size = this.querySelector('.size')
			this.weightChild = this.querySelector('.weight').children
			this.sizeInput = this.querySelector('.size-input')
			this.sizeVal = this.querySelector('.text-size-val')
			this.align = this.querySelector('.align')
			this.alignChild = this.querySelector('.align').children
			this.history_ = this.querySelector('.history')
			this.historyChild = this.querySelector('.history').children
			this.fileDownloadBtn = this.querySelector('.image-upload')
			this.createLinkBtn = this.querySelector('.create-link')
			this.createImgLinkBtn = this.querySelector('.image-link')
			this.createVideoLinkBtn = this.querySelector('.video-link')
			this.fontFamily = this.querySelector('.font-family')
			this.textColor = this.querySelector('.text-color')
			this.textBackColor = this.querySelector('.text-back-color')
			this.textHead = this.querySelector('.text-head')
			this.textParagraph = this.querySelector('.text-paragraph')
			this.textBr = this.querySelector('.text-br')
			this.textHr = this.querySelector('.text-hr')
			this.textList = this.querySelector('.text-list')
			this.textClearFormat = this.querySelector('.text-clear-format')
			this.textIndex = this.querySelector('.text-index')
			this.imageFloatLeft = this.querySelector('.image-float-left')
			this.ImageFloatRight = this.querySelector('.image-float-right')
			this.ImageFloatCenter = this.querySelector('.image-float-center')
			this.bar = this.querySelectorAll('.bar')
		}
		
	connectedCallback() {
		//чтобы при вставке картинки не сбрасывался фокус - иначе картинка не вставится на место курсора
		this.bar[4].onmousedown = (e) =>{
			return false
		}
		this.changeWeight()
		this.imageResize()
		this.textSize()
		this.changeFont()
		this.history()
		this.createLink()
		this.alignText()
		this.createLink()
		this.createImgLink()
		this.fileDownload()
		this.resizeWindow()
		this.changeTextColor()
		this.changeTextBackColor()	
		this.cnahgeHead()
		this.setParagraph()
		this.setBr()
		this.setHr()
		this.setList()
		this.clearFormat()
		this.setTextIndex()
		this.setFloatImage()
	}

	createBorder(img) {
		let Rect = img.getBoundingClientRect()
		//Удаляем если он есть
		let borderImg = document.querySelector('div.text-area > div.border');
		if(borderImg) {
			borderImg.remove()
			this.selectImageId = ''
		}
		
		let border = document.createElement('div');
		border.className = 'border'
		border.style = `
			position: fixed;
			border: 2px dashed #FFC107;
			width: ${Rect.width}px;
			height:${Rect.height}px;
			left: ${img.offsetLeft-2}px;
			top: ${img.offsetTop-2}px;
		`
		
		let markStyle = `
			position: fixed;
			width: 15px;
			height:15px;
			border-radius: 50%;
			background-color: #38b5a9fa;
		`
		let markLT = document.createElement('div')
		markLT.className = 'markLT'
		markLT.style = markStyle;
		markLT.id = 'mark';
		markLT.style.top = (Rect.top - 5)+ 'px'
		markLT.style.left = (Rect.left - 5) + 'px';
		markLT.style.cursor = 'grab'
		
		let markRT = document.createElement('div')
		markRT.className = 'markRT'
		markRT.style = markStyle;
		markRT.id = 'mark';
		markRT.style.top = (Rect.top - 5)+ 'px'
		markRT.style.left = (Rect.right - 5) + 'px';
		markRT.style.cursor = 'grab'
		
		let markLB = document.createElement('div')
		markLB.className = 'markLB'
		markLB.style = markStyle;
		markLB.id = 'mark';
		markLB.style.top = (Rect.bottom - 5) + 'px';
		markLB.style.left = (Rect.left - 5) + 'px';
		markLB.style.cursor = 'grab'
		
		let markRB = document.createElement('div')
		markRB.className = 'markRB'
		markRB.style = markStyle;
		markRB.id = 'mark';
		markRB.style.top = (Rect.bottom - 5) + 'px';
		markRB.style.left = (Rect.right -5) + 'px';
		markRB.style.cursor = 'grab'
		
		border.appendChild(markLT)
		border.appendChild(markRT)
		border.appendChild(markLB)
		border.appendChild(markRB)

		this.editArea.appendChild(border)
	}
	
	getText ()  {
		console.log(this.editArea.innerHTML)
		return this.editArea.innerHTML;
	}
	setText (text) {
		this.editArea.innerHTML = text;
	}
	editorGetImage () {
		return document.querySelectorAll('.text-area img')
	}
	
	textSize() {
		this.sizeInput.oninput = (e) => {
			document.execCommand("fontSize", false, e.target.value);
		}
	}
	
	alignText() {
		this.align.onclick = (e) => {
			let borderImg = document.querySelector('div.text-area > div.border');
			if (borderImg) {
				borderImg.remove()		
			}
			if(e.target===this.alignChild[0]) {
				document.execCommand("justifyLeft", false, null);
			}
			else if (e.target===this.alignChild[1]) {
				document.execCommand("justifyCenter", false, null)
			}
			else if (e.target===this.alignChild[2]) {
				document.execCommand("justifyRight", false, null)
			}
			else if (e.target===this.alignChild[3]) {
				document.execCommand("justifyFull", false, null)
			}
		}
	}
	
	history() {
		this.history_.onclick = (e) => {
			if(e.target===this.historyChild[0]) {
				document.execCommand("undo", false, null);
				getSelection().removeAllRanges()
			}
			else if (e.target===this.historyChild[1]) {
				document.execCommand("redo", false, null)
				getSelection().removeAllRanges()
			}
		}
	}
	
	createDialoForLink (e)  {
		let urlInput = document.createElement('input')
		urlInput.style.position = 'fixed';
		urlInput.style.top = e.target.offsetTop + 9 + 'px' 
		urlInput.style.left = e.target.offsetLeft + 97 + 'px'
		
		let backInput = document.createElement('div')
		backInput.className = 'create-link-background'
		backInput.innerHTML = 'Url:'
		backInput.style.position = 'fixed';
		backInput.style.top = e.target.offsetTop + 'px' 
		backInput.style.left = e.target.offsetLeft + 62 + 'px'
		
		let createBtn = document.createElement('button')
		createBtn.innerHTML = 'create'
		createBtn.style.position = 'fixed';
		createBtn.style.top = e.target.offsetTop + 11 + 'px' 
		createBtn.style.left = e.target.offsetLeft + 325 + 'px'
		
		backInput.appendChild(urlInput)
		backInput.appendChild(createBtn)
		this.appendChild(backInput)
	}
	createLink() {
		this.createLinkBtn.onclick = (e) => {
			let urlDialog = document.querySelector('.create-link-background')
			if (urlDialog) {
				urlDialog.remove()
				return;
			}  
			this.createDialoForLink(e)
			
			let createBtn = document.querySelector('.create-link-background > button')
			let urlInput = document.querySelector('.create-link-background > input')
			createBtn.onclick = () => {
				document.execCommand('insertHTML', false, '<a href=' + urlInput.value + '>'+ document.getSelection() + '</a>')
				//открытие вкладки по клику
				this.querySelectorAll('a')[this.querySelectorAll('a').length-1].onclick = (e) => {
					window.open(e.target)
				}
			}
		}
	}
	
	createImgLink() {
		this.createImgLinkBtn.onclick = (e) => {
			let getImage = () => this.editorGetImage()
			let urlDialog = document.querySelector('.create-link-background')
			if (urlDialog) {
				urlDialog.remove()
				return;
			} 
			this.createDialoForLink(e)
			
			let createBtn = document.querySelector('.create-link-background > button')
			let urlInput = document.querySelector('.create-link-background > input')
			
			createBtn.onclick = () => {
				document.execCommand('insertImage', false, urlInput.value)
				let imgList = getImage();
					let addImg = imgList[imgList.length-1];
					addImg.style = `
					padding: 5px;
					margin: 0 auto;
					display: flex;
				`
					addImg.width = 100;
			}
			
		}
	}
		
	fileDownload() {

		this.fileDownloadBtn.onchange = (e) => {
			let file = e.target.files;
			let reader = new FileReader();
			let getImage = () => this.editorGetImage()
			
			reader.readAsDataURL(file[0]);
			reader.onloadend = function(progressEvent) {
				let id = getImage().length !=0 ? 'image-' + getImage().length : 'image-0';
				let img = "<img src=" + reader.result + " id=" + id +">";
				document.execCommand("insertHTML", false, img)
				
				//указываем размер последней картинке
				let addImg = document.querySelector(`#${id}`)
				addImg.style = `
					padding: 5px;
					margin: 0 auto;
					display: flex;
				`
				addImg.style.width = 100 + 'px';		
			}						
			this.fileDownloadBtn.value = ''
		}
	}
	
	resizeWindow() {
		window.onresize = () => {
			let borderImg = document.querySelector('div.text-area > div.border');
			if (borderImg) {
				borderImg.remove()		
			}
		}
	}
	
	imageResize() {
		this.editArea.onclick = (e) => {
			let editArea = this.editArea;
			let img = e.target;
			this.selectImageId = e.target.id
			
			if (e.target.localName === 'img') {

				//создаем рамку
				this.createBorder(img)
				//ресайз
				function resizeImage () {
					
					editArea.onmousedown = (e) => {
					
						if (e.target.id==='mark') {
							let xNow = 0;				
							let yNow = 0;						
							editArea.onmousemove = (event) => {
								e.preventDefault();
								let borderImg = document.querySelector('div.text-area > div.border');
								
								function borderMarkResize(borderRect) {							
									let markLT = document.querySelector('.markLT')
									let markRT = document.querySelector('.markRT')
									let markLB = document.querySelector('.markLB')
									let markRB = document.querySelector('.markRB')
									markLT.style.top = (borderRect.top - 6)+ 'px'
									markLT.style.left = (borderRect.left - 6) + 'px';
										
									markRT.style.top = (borderRect.top - 6)+ 'px'
									markRT.style.left = (borderRect.right - 6) + 'px';
							
									markLB.style.top = (borderRect.bottom - 6)+ 'px'
									markLB.style.left = (borderRect.left - 6) + 'px';
	
									markRB.style.top = (borderRect.bottom - 6)+ 'px'
									markRB.style.left = (borderRect.right - 6) + 'px';	
								}
								
								function scaleUp (targetImg, border) {
									let borderRect = border.getBoundingClientRect()
									borderMarkResize(borderRect)
									img.style.width = (borderRect.width + 5) + 'px'
									img.style.height = (borderRect.height + 5) + 'px'
									border.style.left = img.offsetLeft + 5 + 'px';
									border.style.top =  img.offsetTop + 5 + 'px';
									border.style.width = (borderRect.width + 2) + 'px';
									border.style.height = (borderRect.height + 2) + 'px';
								}
								
								function scaleDown (targetImg, border) {
									let borderRect = border.getBoundingClientRect()
									borderMarkResize(borderRect)
									img.style.width = (borderRect.width - 7) + 'px'
									img.style.height = (borderRect.height - 5) + 'px'
									border.style.left = img.offsetLeft + 3 + 'px';
									border.style.top =  img.offsetTop + 3 + 'px';
									border.style.width = (borderRect.width - 7) + 'px';
									border.style.height = (borderRect.height - 7) + 'px';
								}
								if (e.target.className === 'markLT') {
									if (xNow>event.clientX || yNow>event.clientY) {
										if (img.width>=50 && img.height>=50) {	
											scaleUp(img, borderImg)
										}
									}
									else if (xNow<event.clientX || yNow<event.clientY) {
										if (img.width>=50 && img.height>=50) {
											scaleDown(img, borderImg)
										}
									}							
								}
								if (e.target.className === 'markRT') {
									if (xNow<event.clientX || yNow>event.clientY) {
										if (img.width>=50 && img.height>=50) {
											scaleUp(img, borderImg)
										}
									}
									else if (xNow>event.clientX || yNow<event.clientY) {
										if (img.width>=50 && img.height>=50) {
											scaleDown(img, borderImg)
										}
									}							
								}
								if (e.target.className === 'markLB') {
									if (xNow>event.clientX || yNow<event.clientY) {
										if (img.width>=50 && img.height>=50) {	
											scaleUp(img, borderImg)
										}
									}
									else if (xNow<event.clientX || yNow>event.clientY) {
										if (img.width>=50 && img.height>=50) {
											scaleDown(img, borderImg)
										}
									}							
								}
								if (e.target.className === 'markRB') {
									if (xNow<event.clientX || yNow<event.clientY) {
											scaleUp(img, borderImg)
									}
									else if (xNow>event.clientX || yNow>event.clientY) {
										if (img.width>=50 && img.height>=50) {
											scaleDown(img, borderImg)
										}
									}							
								}
							xNow = event.clientX;				
							yNow = event.clientY;
							}
						}
					}
					editArea.onmouseup = (e) => {
						editArea.onmousemove = null;
					}
				}
				resizeImage ()
			}
			//если не картинка удаляем рамку
			else if (e.target.localName != 'img') {
				let borderImg = document.querySelector('div.text-area > div.border');
				if(borderImg) {
					borderImg.remove()
					this.selectImageId = ''
				}
			}
		}
	}
	changeWeight() {
		this.weight.onclick = (e) => {
			if(e.target===this.weightChild[0]) {
				document.execCommand("Bold", false, null);
			}
			else if (e.target===this.weightChild[1]) {
				document.execCommand("Italic", false, null)
			}
			else if (e.target===this.weightChild[2]) {
				document.execCommand("Underline", false, null)
			}
			else if (e.target===this.weightChild[3]) {
				document.execCommand("strikeThrough", false, null)
			}
		}
	}
	changeFont() {
		this.fontFamily.onchange = (e) => {
			document.execCommand('fontName', false, e.target.value)
		}
	}
	changeTextColor() {
		this.textColor.oninput = (e) => {
			document.execCommand('foreColor', false, e.target.value)
		}
	}
	changeTextBackColor() {
		this.textBackColor.oninput = (e) => {
			document.execCommand('hiliteColor', false, e.target.value)
		}
	}
	cnahgeHead() {
		this.textHead.onchange = (e) => {
			document.execCommand('formatBlock', false, '<' + e.target.value + '>')
		}
	}
	setParagraph() {
		this.textParagraph.onclick = () => {
			document.execCommand('formatBlock', false, '<p>')
		}
	}
	setBr() {
		this.textBr.onclick = () => {
			document.execCommand('insertBrOnReturn', false, null)
		}
	}
	setHr() {
		this.textHr.onclick = () => {
			document.execCommand('insertHorizontalRule', false, null)
		}
	}
	setList() {
		this.textList.onchange = (e) => {
			if (e.target.selectedIndex === 0) {
				document.execCommand('insertUnorderedList', false, null)
			}
			else if (e.target.selectedIndex === 1) {
				document.execCommand('insertOrderedList', false, null)
			}
		}
	}
	clearFormat() {
		this.textClearFormat.onclick = (e) => {
			document.execCommand('removeFormat', false, null)
		}
	}
	setTextIndex() {
		this.textIndex.onchange = (e) => {
			if (e.target.selectedIndex === 0) {
				document.execCommand('subscript', false, null)				
			}
			else if (e.target.selectedIndex === 1) {
				document.execCommand('superscript', false, null)
			}
		}
	}
	setFloatImage() {
		this.imageFloatLeft.onclick = (e) => {
			if(this.editorGetImage().length !=0) {
				if(this.selectImageId != '') {
					let borderImg = document.querySelector('div.text-area > div.border');
					document.querySelector(`#${this.selectImageId}`).style.cssFloat = 'left'
					if(borderImg) {
						borderImg.remove()
					}
				}
				
			}
		}
		this.ImageFloatCenter.onclick = (e) => {
			if(this.editorGetImage().length !=0) {
				if(this.selectImageId != '') {
					let borderImg = document.querySelector('div.text-area > div.border');
					document.querySelector(`#${this.selectImageId}`).style.cssFloat = ''
					document.querySelector(`#${this.selectImageId}`).style.cssLeft = ''
					if(borderImg) {
						borderImg.remove()
					}
				}
			}
		}
		this.ImageFloatRight.onclick = (e) => {
			if(this.editorGetImage().length !=0) {
				if(this.selectImageId != '') {
					let borderImg = document.querySelector('div.text-area > div.border');
					document.querySelector(`#${this.selectImageId}`).style.cssFloat = 'right'
					if(borderImg) {
						borderImg.remove()
					}
				}
			}
		}
	}
}
customElements.define('rich-editor', RichEditor);
