<?php
// El encabezado completo
require_once "header.php";?>
	
	<main class="columna--left">
		<section>
			<article>
				<header class="heading">
					<h1><span class="icon-mail right left"></span>Contaco</h1>
				</header>
			</article>
		</section>
		<section>
			<ul class="breadcrums">
				<li class="breadcrums--label">Ud. está aquí: </li>
				<li><a href="index.php">Inicio</a></li>
				<li class="breadcrums-muted">Productos</li>
			</ul>
		</section>
		
		<section>
			<article class="centrado">
				<h2>Crear tu cuenta gratarola</h2>
				<div class="formulario">
					<form class="vform" name="" id="" action="">
						<fieldset>
							<label>Input</label>
							<input type="text" name="" id="" placeholder="Sample Input" />
						</fieldset>
						<fieldset>
							<label>Datepicker</label>
							<input type="date" class="datepicker" name="" id="datepicker1" style="width:100%" placeholder="mm/dd/yyyy" />
						</fieldset>
						<fieldset>
							<label>Select List</label>
							<select name="" id="">
								<option value="Option 1">Option 1</option>
								<option value="Option 2">Option 2</option>
								<option value="Option 3">Option 3</option>
							</select>
						</fieldset>
						<fieldset>
							<label>Textarea</label>
							<textarea name="" id=""></textarea>
						</fieldset>
						<fieldset>
							<label>Checkboxes</label>
							<label>
								<input type="checkbox" id="checkbox" value="checkbox1" />
								<span>Checkbox1</span>
							</label>
							<label>
								<input type="checkbox" id="checkbox" value="checkbox2" />
								<span>Checkbox2</span>
							</label>
						</fieldset>
						<fieldset>
							<label>Radio Buttons</label>
							<label>
								<input type="radio" name="radio" id="radio" value="radio1" />
								<span>Radio1</span>
							</label>
							<label>
								<input type="radio" name="radio" id="radio" value="radio2" />
								<span>Radio2</span>
							</label>
						</fieldset>
						<fieldset>
							<label>Prepended input</label>
							<span class="pre">$</span>
							<input class="pre" type="text" name="" id="" />
						</fieldset>
						<fieldset>
							<label>Appended input</label>
							<input class="post" type="text" name="" id="" />
							<span class="post">.com</span>
						</fieldset>
						<fieldset>
							<label>combined input</label>
							<span class="pre">$</span>
							<input class="pre-post" type="text" name="" id="" />
							<span class="post">.00</span>
						</fieldset>
						<fieldset>
							<label>Search</label>
							<span type="submit" class="pre" name="">Search</span>
							<input class="pre" type="text" name="" id="" />
						</fieldset>
						<fieldset>
							<label>Search</label>
							<input class="post" type="text" name="" id="" />
							<span type="submit" class="post" name="">Search</span>
						</fieldset>
					</form>
				</div>
				<div class="formulario">
					<form class="hform" name="" id="">
						<label>Input</label>
						<input type="text" name="" id="" placeholder="Sample Input" />
					
						<label>Datepicker</label>
						<input type="date" class="datepicker" name="" id="datepicker2" placeholder="mm/dd/yyyy" />
					
						<label>Select List</label>
						<select name="" id="">
							<option value="Option 1">Option 1</option>
							<option value="Option 2">Option 2</option>
							<option value="Option 3">Option 3</option>
						</select>
					
						<label>Textarea</label>
						<textarea name="" id=""></textarea>
						<fieldset>
							<label>Checkboxes</label>
							<input type="checkbox" name="checkbox" id="checkbox" value="checkbox1" />Checkbox1
							<input type="checkbox" name="checkbox" id="checkbox" value="checkbox2" />Checkbox2
						</fieldset>
						<fieldset>
							<label>Radio Buttons</label>
							<input type="radio" name="radio" id="radio" value="radio1" />Radio1
							<input type="radio" name="radio" id="radio" value="radio2" />Radio2
						</fieldset>
						<fieldset>
							<label>Prepended input</label>
							<span class="pre">$</span>
							<input class="pre" type="text" name="" id="" />
						</fieldset>
						
						<fieldset>
							<label>Appended input</label>
							<input class="post" type="text" name="" id="" />
							<span class="post">.com</span>
						</fieldset>
						<fieldset>
							<label>combined input</label>
							<span class="pre">$</span>
							<input class="pre-post" type="text" name="" id="" />
							<span class="post">.00</span>
						</fieldset>
						<fieldset>
							<label>Search</label>
							<span type="submit" class="pre icon-search" name=""></span>
							<input class="pre" type="text" name="" id="" />
						</fieldset>
						<fieldset>
							<label>Search</label>
							<input class="post" type="text" name="" id="" />
							<span type="submit" class="post" name=""><i class="icon-search right"></i>Buscar</span>
						</fieldset>

						<button type="submit" class="boton azul">
							<span class="icon-enter right"></span>
							Registrarse
						</button>
						<button type="reset" class="boton rojo">
							<span class="icon-x right"></span>
							Borrar
						</button>
					</form>
				</div>
			</article>
		</section>
		
		<section>
			<article>
				<!-- <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.4989085320008!2d-68.853548!3d-32.937834999999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU2JzE2LjIiUyA2OMKwNTEnMTIuOCJX!5e0!3m2!1ses!2sar!4v1434225259242" width="100%" height="300" frameborder="0" style="border:0"></iframe> -->
			</article>
		</section>
	</main>

<?php
// El Sidebar completo
require_once "sidebar-right.php";?>
	
<?php
// El Sidebar completo
require_once "sidebar.php";?>

<?php
// El pie de página completo
require_once "footer.php";?>