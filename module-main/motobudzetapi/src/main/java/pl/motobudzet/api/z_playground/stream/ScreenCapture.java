package pl.motobudzet.api.z_playground.stream;

import java.awt.*;
import java.awt.image.BufferedImage;
public class ScreenCapture {

    public static BufferedImage captureScreen(int x, int y, int width, int height) throws Exception {
        Rectangle captureRect = new Rectangle(x, y, width, height);
        Robot robot = new Robot();
        return robot.createScreenCapture(captureRect);
    }
}