// Botón abridor del formulario del producto
(function()
{
	$(document).on("ready", inicioIE8);
	function inicioIE8()
	{
		$("#menu").on("click", abridorIE8);
		function abridorIE8(ev)
		{
			ev.preventDefault();
			$("#header_nav").slideToggle("fast");
		}
	}
}());