package pl.motobudzet.api.infrastructure.thymeleaf;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

public class NumberFormatter {

    private NumberFormatter() {
    }

    public static String formatNumber(long number) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
        symbols.setGroupingSeparator(' ');
        DecimalFormat formatter = new DecimalFormat();
        formatter.setDecimalFormatSymbols(symbols);
        formatter.setGroupingSize(3);
        formatter.setGroupingUsed(true);
        return formatter.format(number);
    }
}