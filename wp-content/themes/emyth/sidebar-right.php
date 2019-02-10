<?php
/*
/* sidebar-right.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/
?>
	<!-- Sidebar -->
		<aside class="sidebar izquierda-contenido padding">
			<div class="widget">
				<section class="widget--box">
					<article class="widget--box--content">
						<form action="<?php bloginfo('url');?>" role="search" class="form--search">
							<fieldset class="form--search--caja">
								<button type="submit" class="form--search--boton">
									<img title="Buscar..." alt="Buscar..." src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAA3NCSVQICAjb4U/gAAAAElBMVEX///8AAAAAAAAAAAAAAAAAAABknMCaAAAABnRSTlMAESIzRFWQJKqlAAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M1cbXjNgAAASFJREFUSIntVbsOgkAQhAN7NdKrxF5Bel/0Ktz//4osh/cwMruliUwDJJOdnX0RRRMm/BPism02Ap66aa3bC8tLtMGT060Hoj5hYqYt5jCg4+kHG7Dc5hUZQiEpwwNFrnCWyioqbHzmPHRJtOPEnbNAIdcoxf23909QcexHp30fI3Zyjf1IQSVT32kiJSpQn0CNIcoiJtIcld8N5Dr2pzBDU1EJO0O9fieJe+1Nzw5Oj5tCxewCTfiZeDWzsSvamWtRmvUaNxNsIV6vLGAC8X79HIC4Gm7K8AB+lkfKrlD8uYiX+XbRt5M7Fwap6KhFtlINS6Rus9fP1wYVekNwJg1W0iSNHTCVYUgJsS869x8x4jVanICZFyJexxTyJkz4WbwA5P1v9VK40w4AAAAASUVORK5CYII=" />
								</button>
								<input class="form--search--input gradient" type="text" placeholder="Buscar" id="s" name="s" />
							</fieldset>
						</form>
					</article>
				</section>
				<?php dynamic_sidebar('sidebar_right');?>
			</div>
		</aside><!-- Fin Sidebar -->