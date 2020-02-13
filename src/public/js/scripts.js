$(document).ready(function() {



    $('.btn-reply').click(function() {
        $(this).next().find('.reply-comment').slideToggle();
    });


    $('#post-Thread').hide();

    $('#btn-toggle-NewThread').click(function(e) {
        e.preventDefault();
        $('#post-Thread').slideToggle();
    });

    $('#post-comment').hide();

    $('#btn-toggle-NewComment').click(function(e) {
        e.preventDefault();
        $('#post-comment').slideToggle();
    });


    $('#edit-thread').hide();







    //------------- Editar & eliminar comentarios

    $('.btn-delete').click(function(e) { // eliminar comentario
        try {
            e.preventDefault();
            let $this = $(this);
            let commentId = $this.data('comment');
            let threadId = $this.data('thread');
            $('#modalDeleteComment').data('thread', threadId);
            $('#modalDeleteComment').data('comment', commentId);
            $("#deleteModal").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#modalDeleteComment').click(function(e) { // eliminar comentario modal
        try {
            e.preventDefault();
            let $this = $(this);
            let commentId = $this.data('comment');
            let threadId = $this.data('thread');
            $.ajax({
                url: '/commentDelete/' + threadId + '/' + commentId,
                type: 'DELETE',

                success: function(respuesta) {
                    $('#' + commentId).hide();
                    $("#deleteModal").modal('hide');
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal' + e);
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('.btn-edit').click(function(e) { // editar comentario
        try {
            e.preventDefault();
            let $this = $(this);
            let commentId = $this.data('comment');
            let threadId = $this.data('thread');
            let text = document.getElementById(`text_${commentId}`).innerHTML;
            $('#text_' + commentId).hide();
            document.getElementById(`textArea_${commentId}`).innerHTML = text;
            $('#textArea_' + commentId).show();
            $('#btn_' + commentId).show();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('.btn-updateCommnet').click(function(e) { //boton enviar cambios de editar comentario
        try {
            e.preventDefault();
            let $this = $(this);
            let commentId = $this.data('comment');
            let threadId = $this.data('thread');
            let text = $.trim($(`#textArea_${commentId}`).val());
            console.log('texto: ' + text);
            if (text == "" || text == undefined) {
                alert('Comentario invalido');
            } else {
                $.ajax({
                    url: '/commentUpdate/' + threadId + '/' + commentId,
                    type: 'PUT',
                    data: {
                        text: text
                    },
                    dataType: 'json',
                    success: function(respuesta) {
                        document.getElementById(`text_${commentId}`).innerHTML = text;
                        $('#textArea_' + commentId).hide();
                        $('#btn_' + commentId).hide();
                        $('#text_' + commentId).show();
                    },
                    error: function() {
                        alert('Ups ! Algo ha salido mal' + e);
                    }

                });
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });









    //----------------- integrantes / investigadores------------

    $(".custom-file-input").on("change", function() { // nombre foto
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    $('.btn-delete-member').click(function(e) { // borrar integrante
        try {
            e.preventDefault();
            let $this = $(this);
            let member = $this.data('member');
            $('#modalDeleteMember').data('member', member);
            $("#deleteModalMember").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#modalDeleteMember').click(function(e) { // borrar integrante modal
        try {
            e.preventDefault();
            let $this = $(this);
            let member = $this.data('member');
            $.ajax({
                url: '/memberDelete/' + member,
                type: 'DELETE',

                success: function(respuesta) {
                    $('#memberid_' + member).hide();
                    $("#deleteModalMember").modal('hide');
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal' + e);
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });












    // -------- hilo ------------------------------------------
    $('.btn-thread').click(function(e) { //nuevo hilo
        try {
            console.log(' ------ 1 ------');
            e.preventDefault();
            window.delta = quill.root.innerHTML.trim();
            console.log(' ------ 2 ------');
            window.title = $.trim($('#title').val());
            console.log(' ------ 3 ------');
            $.ajax({
                url: '/new-thread',
                type: 'POST',
                data: {
                    text: window.delta,
                    title: window.title,
                },
                dataType: 'json',

                success: function(respuesta) {
                    console.log('--' + respuesta.error);
                    if (respuesta.error == true) {
                        $("#Modal-newThread").modal();
                    } else {
                        const link = '/foro/id/' + respuesta.data;
                        window.location.href = link;
                    }
                }

            });
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
            console.error(e);
            console.log(' ------ 5 ------');
        }
    });


    $('#btn-newThread-error').click(function(e) { //nuevo hilo Modal
        $("#Modal-newThread").modal('hide');

    });

    $('.btn-delete-thread').click(function(e) { //Borrar hilo
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $('#btnModalDeleteThread').data('id', id);
            $("#deleteModalThread").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btnModalDeleteThread').click(function(e) { //Borrar hilo Modal
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $.ajax({
                url: '/threadDelete/' + id,
                type: 'DELETE',

                success: function(respuesta) {
                    if (respuesta.error == false) {
                        $('#threadId_' + id).hide();
                        $("#deleteModalThread").modal('hide');
                    } else {
                        $("#deleteModalThread").modal('hide');
                        alert('Ups ! Algo ha salido mal');
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal' + e);
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('.btn-delete-thread-inside').click(function(e) { //Borrar hilo desde dentro
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $('#btnModalDeleteThreadInside').data('id', id);
            $("#deleteModalThreadInside").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btnModalDeleteThreadInside').click(function(e) { //Borrar hilo desde dentro Modal
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $.ajax({
                url: '/threadDelete/' + id,
                type: 'DELETE',

                success: function(respuesta) {
                    if (respuesta.error == false) {
                        $("#deleteModalThread").modal('hide');
                        window.location.href = '/foro';
                    } else {
                        $("#deleteModalThread").modal('hide');
                        alert('Ups ! Algo ha salido mal');
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal' + e);
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });



    $('#btn-edit-thread-inside').click(function(e) { //Mostrar Editar hilo desde dentro
        try {
            e.preventDefault();
            let $this = $(this);
            const MyDiv1 = document.getElementById('dataBase-thread');
            const MyTitle = $('#dataBase-thread-title').text();
            const MyTitleEdit = document.getElementById('title');


            quill.root.innerHTML = MyDiv1.innerHTML;
            MyTitleEdit.value = MyTitle;
            $('#dataBase-thread').hide();
            $('#btn-edit-thread-inside').hide();
            $('#dataBase-thread-title').hide();
            $('#edit-thread').show();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });



    $('#btn-update-thread').click(function(e) { //boton enviar cambios de editar hilo
        try {
            e.preventDefault();
            let $this = $(this);
            let threadId = $this.data('id');
            window.delta = quill.root.innerHTML.trim();
            window.title = $.trim($('#title').val());
            if (window.title == "" || window.title == undefined) {
                alert('Texto invalido');
            } else {
                $.ajax({
                    url: '/threadUpdate/' + threadId,
                    type: 'PUT',
                    data: {
                        text: window.delta,
                        title: window.title,
                    },
                    dataType: 'json',
                    success: function(respuesta) {
                        if (respuesta.error == true) {
                            alert('Error el hilo no pudo ser actualizado, intenta de nuevo');
                        } else {
                            const link = '/foro/id/' + threadId;
                            window.location.href = link;
                        }
                    },
                    error: function() {
                        alert('Ups ! Algo ha salido mal' + e);
                    }

                });
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });











    // ---------- Recuperar contraseña  --------------------------------------------

    $('#errorRestorePassword').hide();
    $('#formRestorePassword-newPassword').hide();
    $('#codePin').hide();

    $('#loader2').hide();
    $('#loader3').hide();
    $('#updatePassSuccess').hide();

    let email;

    $('#btnPasswordCode').click(function(e) { //verifica correo envia email
        try {
            e.preventDefault();
            email = $.trim($('#email').val());
            $('#btnPasswordCode').hide();
            $('#errorRestorePassword').hide();
            $('#textLogin').hide();
            $('#codePin').hide();
            if (email != "" && email != undefined) {
                $.ajax({
                    url: '/userEmail',
                    type: 'POST',
                    data: {
                        email: email,
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        $('#loader2').show();
                    },
                    complete: function() {
                        $('#loader2').hide();

                    },
                    success: function(respuesta) {
                        if (respuesta.user == false) {
                            document.getElementById("errorMsg").textContent = "El correo no esta registrado";
                            $('#errorRestorePassword').show();
                            $('#btnPasswordCode').show();
                            $('#textLogin').show();
                        } else {
                            document.getElementById("email").disabled = true;
                            $('#codePin').hide();
                            $('#btnPasswordCode').hide();
                            $('#codePin').slideToggle();
                        }
                    },
                    error: function() {
                        alert('Ups ! Algo ha salido mal' + e);
                    }

                });

            } else {
                document.getElementById("errorMsg").textContent = "Correo no valido";
                $('#errorRestorePassword').show();
                $('#btnPasswordCode').show();
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    let pin;

    $('#btnPasswordPin').click(function(e) { //verificar pin
        try {
            e.preventDefault();
            pin = $.trim($('#pinCode').val());
            if (pin != "" && pin != undefined) {
                $.ajax({
                    url: '/userPin',
                    type: 'POST',
                    data: {
                        email: email,
                        pin: pin,
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        $('#loader2').show();
                    },
                    complete: function() {
                        $('#loader2').hide();

                    },
                    success: function(respuesta) {
                        if (respuesta.pin == false) {
                            document.getElementById("errorMsg").textContent = "El codigo es incorrecto";
                            $('#errorRestorePassword').show();

                        } else {
                            $('#errorRestorePassword').hide();
                            $('#formRestorePassword-email').hide();
                            $('#codePin').show();
                            $('#codePin').slideToggle();

                            $('#errorRestorePassword2').hide();
                            $('#formRestorePassword-newPassword').hide();
                            $('#formRestorePassword-newPassword').slideToggle();
                        }
                    },
                    error: function() {
                        alert('Ups ! Algo ha salido mal' + e);
                    }

                });

            } else {
                document.getElementById("errorMsg").textContent = "Pin no valido";
                $('#errorRestorePassword').show();
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btnRestorePassword-updatePassword').click(function(e) { //actualizar contraseña
        try {
            e.preventDefault();
            $('#errorRestorePassword2').hide();
            const password1 = $.trim($('#newPass').val());
            const password2 = $.trim($('#newPassConfirm').val());
            if (password1 != "" && password1 != undefined && password2 != "" && password2 != undefined) {
                if (password2 == password1) {
                    $.ajax({
                        url: '/userRestorePassword',
                        type: 'POST',
                        data: {
                            email: email,
                            pin: pin,
                            password: password1,
                        },
                        dataType: 'json',
                        beforeSend: function() {
                            $('#loader3').show();
                        },
                        complete: function() {
                            $('#loader3').hide();

                        },
                        success: function(respuesta) {
                            if (respuesta.update == false) {
                                document.getElementById("errorMsg2").textContent = "Error al actualizar contraseña";
                                $('#errorRestorePassword2').show();

                            } else {
                                $('#errorRestorePassword2').hide();
                                $('#formRestorePassword-newPassword').hide();
                                $('#updatePassSuccess').show();

                            }
                        },
                        error: function() {
                            alert('Ups ! Algo ha salido mal');
                        }

                    });
                } else {
                    document.getElementById("errorMsg2").textContent = "Las contraseñas no coinciden";
                    $('#errorRestorePassword2').show();
                }

            } else {
                document.getElementById("errorMsg2").textContent = "Contraseña invalida";
                $('#errorRestorePassword2').show();
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });







    // ----------- PROYECTOS ---------------------

    $('#post-project').hide();
    $('#edit-project').hide();

    $('#btn-toggle-Newproject').click(function(e) {
        $('#post-project').slideToggle();
    });

    $('#btnNewProject').click(function(e) { //nuevo proyecto
        try {
            e.preventDefault();
            window.delta = quill.root.innerHTML.trim();
            window.title = $.trim($('#title-newProject').val());
            window.description = $.trim($('#descriptionProject').val());
            $.ajax({
                url: '/new-project',
                type: 'POST',
                data: {
                    text: window.delta,
                    title: window.title,
                    description: window.description,
                },
                dataType: 'json',

                success: function(respuesta) {
                    console.log('--' + respuesta.error);
                    if (respuesta.error == true) {
                        alert('error');
                    } else {
                        const link = '/project/id/' + respuesta.data;
                        window.location.href = link;
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal');
                }

            });
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
            console.error(e);
            console.log(' ------ 5 ------');
        }
    });

    $('.btn-delete-project').click(function(e) { //Borrar proyecto
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $('#btnModalDeleteProject').data('id', id);
            $("#deleteModalProject").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btnModalDeleteProject').click(function(e) { //Borrar proyecto Modal
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $.ajax({
                url: '/projectDelete/' + id,
                type: 'DELETE',

                success: function(respuesta) {
                    if (respuesta.error == false) {
                        $('#projectId_' + id).hide();
                        $("#deleteModalProject").modal('hide');
                    } else {
                        $("#deleteModalProject").modal('hide');
                        alert('Ups ! Algo ha salido mal');
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal');
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btn-delete-project-inside').click(function(e) { //Borrar proyecto INSIDE
        try {
            e.preventDefault();
            let $this = $(this);
            $("#deleteModalProject-inside").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('#btnModalDeleteProject-inside').click(function(e) { //Borrar proyecto Modal INSIDE
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $.ajax({
                url: '/projectDelete/' + id,
                type: 'DELETE',

                success: function(respuesta) {
                    if (respuesta.error == false) {
                        $("#deleteModalProject").modal('hide');
                        const link = '/investigacion';
                        window.location.href = link;

                    } else {
                        $("#deleteModalProject").modal('hide');
                        alert('Ups ! Algo ha salido mal');
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal');
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });




    $('#btn-edit-project').click(function(e) { //Mostrar Editar hilo desde dentro
        try {
            e.preventDefault();
            let $this = $(this);
            const MyDiv1 = document.getElementById('dataBase-project');
            const MyTitle = $('#dataBase-project-title').text();

            const MyTitleEdit = document.getElementById('title');
            quill.root.innerHTML = MyDiv1.innerHTML;
            MyTitleEdit.value = MyTitle;
            $('#dataBase-project').hide();
            $('#btn-edit-project').hide();
            $('#dataBase-project-title').hide();
            $('#btn-back').hide();
            $('#edit-project').show();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });


    $('#btn-update-project').click(function(e) { //boton enviar cambios de editar proyecto
        try {
            e.preventDefault();
            let $this = $(this);
            let proyectId = $this.data('id');
            window.delta = quill.root.innerHTML.trim();
            window.title = $.trim($('#title').val());
            window.description = $.trim($('#description').val());
            if (window.title == "" || window.title == undefined || window.delta == '' || window.delta == undefined || window.description == '' || window.description == undefined) {
                alert('Texto invalido');
            } else {
                $.ajax({
                    url: '/proyectUpdate/' + proyectId,
                    type: 'PUT',
                    data: {
                        content: window.delta,
                        title: window.title,
                        description: window.description,
                    },
                    dataType: 'json',
                    success: function(respuesta) {
                        if (respuesta.error == true) {
                            alert('Error el proyecto no pudo ser actualizado, intenta de nuevo');
                        } else {
                            const link = '/project/id/' + proyectId;
                            window.location.href = link;
                        }
                    },
                    error: function() {
                        alert('Ups ! Algo ha salido mal');
                    }

                });
            }
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });


    // ------------------- PUBLICACIONES -----------------------------

    $('#post-publication').hide();

    $('#btn-toggle-NewPublication').click(function(e) {
        $('#post-publication').slideToggle();
    });


    $('#btnNewPublication').click(function(e) { //nueva publicacion
        try {
            e.preventDefault();
            window.title = $.trim($('#title').val());
            window.url = $.trim($('#url').val());
            window.date = $.trim($('#date').val());
            $.ajax({
                url: '/new-publication',
                type: 'POST',
                data: {
                    title: window.title,
                    link: window.url,
                    date: window.date,
                },
                dataType: 'json',

                success: function(respuesta) {
                    if (respuesta.error == true) {
                        alert('error');
                    } else {
                        const link = '/investigacion/publicaciones/';
                        window.location.href = link;
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal');
                }

            });
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });

    $('.btn-delete-publication ').click(function(e) { //Borrar publicacion
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $('#btnModalDeletePublication').data('id', id);
            $("#deleteModalPublication").modal();
        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });


    $('#btnModalDeletePublication').click(function(e) { //Borrar publicacion Modal
        try {
            e.preventDefault();
            let $this = $(this);
            let id = $this.data('id');
            $.ajax({
                url: '/publicationDelete',
                type: 'DELETE',
                data: {
                    id: id,
                },
                dataType: 'json',
                success: function(respuesta) {
                    if (respuesta.error == false) {
                        $('#publicationId_' + id).hide();
                        $("#deleteModalPublication").modal('hide');
                    } else {
                        $("#deleteModalPublication").modal('hide');
                        alert('Ups ! Algo ha salido mal');
                    }
                },
                error: function() {
                    alert('Ups ! Algo ha salido mal');
                }

            });

        } catch (e) {
            alert('Ups ! Algo ha salido mal' + e);
        }
    });




    //-------- ORDENAR TABLA ----------------------------

    $('.order').click(function() {
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) {
            rows = rows.reverse()
        }
        for (var i = 0; i < rows.length; i++) {
            table.append(rows[i])
        }
        setIcon($(this), this.asc);
    })

    function comparer(index) {
        return function(a, b) {
            var valA = getCellValue(a, index),
                valB = getCellValue(b, index)
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
        }
    }

    function getCellValue(row, index) {
        return $(row).children('td').eq(index).html()
    }

    function setIcon(element, asc) {
        $("th").each(function(index) {
            $(this).removeClass("sorting");
            $(this).removeClass("asc");
            $(this).removeClass("desc");
        });
        element.addClass("sorting");
        if (asc) element.addClass("asc");
        else element.addClass("desc");
    }

    //---------------  CARRUSEL TOUCH -------

    $(".carousel").on("touchstart", function(event) {
        var xClick = event.originalEvent.touches[0].pageX;
        $(this).one("touchmove", function(event) {
            var xMove = event.originalEvent.touches[0].pageX;
            if (Math.floor(xClick - xMove) > 5) {
                $(this).carousel('next');
            } else if (Math.floor(xClick - xMove) < -5) {
                $(this).carousel('prev');
            }
        });
        $(".carousel").on("touchend", function() {
            $(this).off("touchmove");
        });
    });

});