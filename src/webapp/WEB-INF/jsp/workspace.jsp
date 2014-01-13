<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<script src="/resources/js/right-bar.js"></script>
<div class="row header">
    <div class="col-md-12">header section</div>
</div>
<div class="row fill">
    <div class="col-md-3 right-column">
        Ресурсы проекта
        <div>
            <i class="fa fa-folder"> Папка 1</i>
            <div class="inner">
                <p>Ресурс 1</p>
                <p>Ресурс 2</p>
                <p>Ресурс 3</p>
            </div>
        </div>
        <div>
            <i class="fa fa-folder"> Папка 2</i>
            <div class="inner">
                <p>Ресурс 1</p>
                <p>Ресурс 2</p>
                <p>Ресурс 3</p>
            </div>
        </div>


    </div>
    <div id="center-column" class="col-md-6 center-column">Рабочее окно</div>
    <div class="col-md-3 left-column">
        <div class="processes">Библиотека процессов
            <div class="process">
                Процесс 1
            </div>
            <div class="process">
                Процесс 2
            </div>
        </div>
        <div class="properties">Свойства объекта</div>
    </div>
</div>
<div class="row footer">
    <div class="col-md-12">Консоль</div>
</div>
<%@ include file="/WEB-INF/jsp/footer.jsp" %>