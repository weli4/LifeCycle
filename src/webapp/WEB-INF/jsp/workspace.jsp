<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<script src="/resources/js/right-bar.js"></script>
<div class="row header">
    <div class="col-md-12">header section</div>
</div>
<div class="row fill">
    <div class="col-md-2 right-column">
        Ресурсы проекта
        <div>
            <i class="fa fa-folder">Стадии</i>
            <div class="inner resources">
                <div class="stage">
                    <span>Концепция</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint">
                        <div class=results>

                        </div>
                    </div>
                </div>
                <div class="stage">
                    <span>Разработка</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint"></div>
                </div>
                <div class="stage">
                    <span>Производство</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint"></div>
                </div>
                <div class="stage">
                    <span>Применение</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint"></div>
                </div>
                <div class="stage">
                    <span>Поддержка</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint"></div>
                </div>
                <div class="stage">
                    <span>Утилизация</span>
                    <i class="fa fa-angle-double-right"></i>
                    <div class="checkpoint"></div>
                </div>

            </div>
        </div>


    </div>
    <div id="center-column" class="col-md-7 center-column">

    </div>
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