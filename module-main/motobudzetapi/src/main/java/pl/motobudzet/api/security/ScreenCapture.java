package pl.motobudzet.api.security;

import javax.sound.sampled.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ScreenCapture {

    public static BufferedImage captureScreen(int x, int y, int width, int height) throws Exception {
        Rectangle captureRect = new Rectangle(x, y, width, height);
        Robot robot = new Robot();
        return robot.createScreenCapture(captureRect);
    }
}