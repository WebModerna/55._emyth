// Los cuadros de información. Se debería mejorar el script
(function()
{
	$(document).on("ready", cerrar_cuadro);
	function cerrar_cuadro()
	{
		$('.alerta-rojo .alerta--close a').on("click", borrando);
		function borrando(ev)
		{
			ev.preventDefault();
			$('.alerta-rojo').remove();
		}

		$('.alerta-verde .alerta--close a').on("click", borrando2);
		function borrando2(ev)
		{
			ev.preventDefault();
			$('.alerta-verde').remove();
		}

		$('.alerta-azul .alerta--close a').on("click", borrando3);
		function borrando3(ev)
		{
			ev.preventDefault();
			$('.alerta-azul').remove();
		}

		$('.alerta-amarillo .alerta--close a').on("click", borrando4);
		function borrando4(ev)
		{
			ev.preventDefault();
			$('.alerta-amarillo').remove();
		}

		$('.alerta-gris .alerta--close a').on("click", borrando5);
		function borrando5(ev)
		{
			ev.preventDefault();
			$('.alerta-gris').remove();
		}
	}
}());


// Acordeón
(function()
{
	$(function()
	{
		var iconos =
		{
			header: "ui-icon-plusthick",
			activeHeader: "ui-icon-minusthick"
		};
		$( ".acordeon" ).accordion(
		{
			active: false,
			collapsible: true,
			heightStyle: 'content',
			icons: iconos
		});
	});
}());

// Redimensionador vertical de los cuadros de mensajes de la home
(function()
{
	$(document).ready( function()
	{
		var winHeight = 0;
		var winWidth = 0;
		setContainerDims();

		function setContainerDims()
		{
			winHeight = parseInt( $(window).height() );
			winWidth = parseInt( $(window).width() );
			$( ".mensajes" ).css(
			{
				"width"		: winWidth,
				"height"	: winHeight
			});
		}
		$(window).resize( function()
		{
			setContainerDims();
		});
	});
}());


// El menú
(function()
{
	$(document).on("ready", inicio);
	function inicio()
	{
		$('#menu').on("click", transicion_abrir);

		function transicion_abrir(ev)
		{
			ev.preventDefault();
			$('#header_nav').addClass('navegacion--listado-abrir');
			$('#header_nav').removeClass('navegacion--listado-cerrar');
			$('#menu').off("click", transicion_abrir);

			// Cerrando el menú
			$('#menu').on("click", transicion_cerrar);
			function transicion_cerrar(ev)
			{
				ev.preventDefault();
				$('#header_nav').addClass('navegacion--listado-cerrar');
				$('#header_nav').removeClass('navegacion--listado-abrir');

				//Para asegurarse el menú abierto o cerrado cuando se redimensione la pantalla
				$(window).resize(redimensionador);
				function redimensionador()
				{
					var ancho = $(window).width();
					if (ancho >= 751)
					{
						$('#header_nav').addClass('navegacion--listado-abrir');
						$('#header_nav').removeClass('navegacion--listado-cerrar');
					} else {
						$('#header_nav').addClass('navegacion--listado-cerrar');
						$('#header_nav').removeClass('navegacion--listado-abrir')
					}
				}
				$('#menu').off("click", transicion_cerrar);
				$('#menu').on("click", transicion_abrir);
			}
		}
	}
}());


// Ir arriba
(function()
{
	$(document).on("ready", ir_arriba);

	function ir_arriba()
	{
		$(window).scroll(esconder_mostrar);
		function esconder_mostrar ()
		{
			if( $( this ).scrollTop() > 400 )
			{
				$( "#ir_arriba" ).removeClass( 'gotop-ocultar' );
				$( "#ir_arriba" ).addClass( 'gotop-mostrar' );
			}
			else
			{
				$( "#ir_arriba" ).removeClass( 'gotop-mostrar' );
				$( "#ir_arriba" ).addClass( 'gotop-ocultar' );
			}
		}

		$( "#ir_arriba" ).on( "click", subir );
		function subir()
		{
			$( "body, html, header" ).animate( {
				scrollTop : 0,
				easing : 'easeIn'
			}, 1500 );
			return false;
		}
	}
}());


// Scroll lento de las anclas
(function()
{
	$(document).on("ready", anclador);
	function anclador()
	{
		// $( '#header_nav a[href*=#]' ).on("click", enlentecedor);
		$( '.mensajes--godown a' ).on("click", enlentecedor);
		function enlentecedor()
		{
			if ( location.pathname.replace(/^\//,'' ) == this.pathname.replace(/^\//,'') && location.hostname == this.hostname)
			{
				var $target = $( this.hash );
				$target = $target.length && $target || $( '[name=' + this.hash.slice(1) +']' );
				if ( $target.length )
				{
					var targetOffset = $target.offset().top;
					$("html, body, header").animate( {
						scrollTop: targetOffset,
						easing: 'easeOut'
					}, 1500 );
					return false;
				}
			}
		}
	}
}());


(function()
{
	$(document).on("ready", adosador);
	function adosador()
	{
		// Soporte para IE8 de :even y :odd
		$('li:even').addClass('nth-child-even');
		$('li:odd').addClass('nth-child-odd');
		$('li:first-child').addClass('first-child');
		$('li:last-child').addClass('last-child');
		$('tr:even').addClass('nth-child-even');
		$('tr:odd').addClass('nth-child-odd');
		$('tr:first-child').addClass('first-child');
		$('tr:last-child').addClass('last-child');
		$('.mensajes:last-child').addClass('last-child');
		$('.servicios--articulo:even').addClass('nth-child-even');
		$('.servicios--articulo:odd').addClass('nth-child-odd');

		// Agregando clases a los contenedores de las imágenes insertadas con WordPress
		$('.size-thumbnail').parents('.wp-caption').addClass('size-thumbnail');
		$('.size-medium').parents('.wp-caption').addClass('size-medium');
		$('.size-large').parents('.wp-caption').addClass('size-large');
		$('.size-full').parents('.wp-caption').addClass('size-full');
	}
}());


// Soporte para IE11 en el Flexbox
(function()
{
	if ( navigator.userAgent.match( /msie|trident/i ) )
	{
		$( '.display-flex' ).removeClass( 'flexbox' ).addClass( 'no-flexbox' );
	}
}());


// Parallax
(function()
{
	$( document ).ready( function()
	{
		$( 'section[data-type="parallax_section"]' ).each( function()
		{
			// Variable para asignacion de objeto
			var $bgobjeto = $( this );

			$( window ).scroll( function()
			{
				$window = $( window );
				var positcioncita = $bgobjeto.position();
				// console.log(positcioncita);
				// var yPos = -( $window.scrollTop() / $bgobjeto.data( 'speed' ) );
				var yPos = -( ( $window.scrollTop() - positcioncita.top ) / $bgobjeto.data( 'speed' ) );

				// cordinadas del background
				var coords = '50% '+ yPos + 'px';

				// moviendo el background
				$bgobjeto.css( { backgroundPosition: coords } );
			});
		});
	});
}());

// Validador del Formulario de la encuesta
(function()
{
	$(document).ready( function()
	{});
}());


// Controlar si están chequeadas las opciones
(function()
{
	$(document).on("submit", function()
	{
		if ( $('input.ct_message_checkbox').attr('checked') )
		{
			$('input.ct_message_checkbox').checked();
		}
	});
}());


//Anclas de los mensajes de la home..
(function()
{
	$( document ).on( "ready", movedorHome );
	function movedorHome( ev )
	{
		var anclas = $( ".mensajes--godown-link" );
		var destinos = $( ".mensajes" );

		for ( var i = 0; destinos.length > i; i++ )
		{
			if( destinos[ i + 1 ] )
			{
				anclas[ i ].setAttribute( "href", "#" + destinos[ i + 1 ].getAttribute( 'id' ) );
			}
		}
		anclas[ anclas.length - 1 ].remove();
	}
}());