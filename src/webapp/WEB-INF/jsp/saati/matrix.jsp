<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>

<script type="text/javascript" src="<c:url value="/resources/js/dss.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.keyfilter-1.7.min.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/saati.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/common.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.growl.js"/>"> </script>

    <br />
<div id="dop_bg">
    <div class="up_div">
        <h1 style="text-align:center;">Многокритериальный анализ альтернатив по методу Т.Саати</h1>
        <table width="100%" border="0">
            <tr>
                <td width="50%" align="left" valign="bottom"> <h3 style="padding-bottom:0; margin-bottom:0"><a href="/" >Варианты задач</a></h3></td>
            </tr>
        </table>
        <div class="clearfloat"></div>
    </div>
    <div class="r-border-shape">
        <div class="tb">
            <div class="cn l" ></div>
            <div class="cn r"></div>
        </div>
        <div class="content_box" style="padding-left: 30px;">

            <h2>${headerText}</h2>
            <br/>
            <div id="steps_panel" hidden="${multiModeFlag}">
            Шаг
            <span id="step_number">1</span>
            из
            <span id="step_count">${max_step}</span>
            :
            <span id="step_name">анализ критериев</span>
            </div>
            <br /><br />
            Для указания уровня приоритета используйте числа от 1/9 до 9.
            <br /><br />
            <span id="legend_helper"></span>
            <br />
            <span id="input_helper" style="padding: 3px; background-color: red;font-weight: bold;color: white;display:none;"></span>
            <br /><br />
            <div style="float:left;width:350px;">
                <div id="matrix" >
                    <form name="matrix">
                        <table cellpadding="0" cellspacing="0">
                            <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                                <tr>
                                <c:forEach var="j" begin="0" end="${alternativesNumber - 1}" >
                                   <c:choose>
                                        <c:when test="${j!=i}">
                                            <td><input type="text" name="matrix[${i}][${j}]" > </td>
                                        </c:when>
                                        <c:otherwise>
                                            <td><input type="text" name="matrix[${i}][${j}]" value="1" readonly="true" > </td>
                                        </c:otherwise>
                                   </c:choose>
                                </c:forEach>
                                    <td class="legend_y">&#${65+i};</td>
                                </tr>
                            </c:forEach>


                            <tr>
                                <c:forEach var="i" begin="0" end="${alternativesNumber-1}">
                                    <td class="legend_x">&#${65+i};</td>
                                </c:forEach>

                                <td class="legend_x"></td>
                            </tr>
                        </table>
                    </form>
                </div>
                <br />
                <input type="button" name="calc_matrix" value="Рассчитать"/>
                <input type="button" name="next" value="Далее" hidden="true"   />
                <a href="/saati//multiple/result"><input type="button" name="end" value="Завершить" hidden="true"   /></a>
            </div>
            <div id="legend" style="padding-left: 70px;float:left">
                <b>Легенда:</b>
                <ol id="legend_ol" type="A">
                    <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                        <li>${alternativesArray[i]}<span></span></li>
                    </c:forEach>
                </ol>
                <br />
                <div id="matrix_helper_no" class="matrix_result" style="display:none;color:red;">
                    Матрица не согласованна. Пересмотрите значения матрицы.
                </div>
                <div id="matrix_helper_yes" class="matrix_result" style="display:none;color:green;">
                    Матрица согласованна.
                </div>
                <br />
                <div id="vectors" class="matrix_result" style="display:none;">
                    Собственные векторы: <br />
                    <span id="vector"></span>
                </div>
                <div class="parametrs matrix_result" style="display:none;">
                    Индексы: <br />
                    λ = <span id="lambda"></span><br />
                    ИС = <span id="cons_index"></span><br />
                    ОC = <span id="attit_cons"></span>
                </div>
            </div>
            <div style="clear:both"></div>
            <br />
        </div>
        <div class="bb">
            <div class="cn l"></div>
            <div class="cn r"></div>
        </div>
    </div>
    <div class="up_div">
        <div >
            &copy;&nbsp;&nbsp;МИРЭА
        </div>
    </div>
    <div hidden="true" id="multi_mode_flag">${multiModeFlag}</div>
</div>





<%@ include file="/WEB-INF/jsp/footer.jsp" %>