<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>


    <div class="row row-offcanvas row-offcanvas-right" >

        <div >

            <div class="jumbotron">
                <h1>Анализ иерархий </h1>
                <p>На этом ресурсе можно попробовать использовать метод анализа иерархий Т.Саати. Ниже перечисленны варианты использования</p>
            </div>
            <div class="row">
                <div class="col-6 col-sm-6 col-lg-6">
                    <h2> Простое сравнение альтернатив </h2>
                    <p>Простое сравнение от 2 до 8 альтернатив </p>
                    <p><a class="btn btn-default" href="<c:url value="/saati/single"/>" role="button">Использовать &raquo;</a></p>
                </div><!--/span-->
                <div class="col-6 col-sm-6 col-lg-6">
                    <h2> Анализ системы с неиерархичными критериями </h2>
                    <p>Сравнение альтернатив с учетом критериев </p>
                     <p><a class="btn btn-default" href="<c:url value="/saati/multiple"/>" role="button">Использовать &raquo;</a></p>
                </div><!--/span-->
                <div class="col-6 col-sm-6 col-lg-6">
                    <h2>Анализ с изменяющимися суждениями</h2>
                    <p>Сравнение альтернатив, с учетом изменения суждений в зависимости от заданного параметра </p>
                    <p><a class="btn btn-default" href="<c:url value="/saati/dynamic"/>" role="button">Использовать&raquo;</a></p>
                </div><!--/span-->
                <div class="col-6 col-sm-6 col-lg-6">
                    <h2>Анализ системы с неиерархичнымикритериями и изменяющимися суждениями</h2>
                    <p>Сравнение альтернатив с учетом критериев и изменения суждений </p>
                    <p><a class="btn btn-default" href="<c:url value="/saati/dynamic/multiple"/>" role="button">Использовать  &raquo;</a></p>
                </div><!--/span-->
            </div><!--/row-->
        </div><!--/span-->


    </div><!--/row-->






<%@ include file="/WEB-INF/jsp/footer.jsp" %>