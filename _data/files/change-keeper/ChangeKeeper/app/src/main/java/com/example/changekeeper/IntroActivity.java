package com.example.changekeeper;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.github.paolorotolo.appintro.AppIntro2;
import com.github.paolorotolo.appintro.AppIntroFragment;
import com.github.paolorotolo.appintro.model.SliderPage;

import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;


public class IntroActivity extends AppIntro2 {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar toolbar = getSupportActionBar();
        toolbar.hide();
        // Note here that we DO NOT use setContentView();

        // Instead of fragments, you can also use our default slide.
        // Just create a `SliderPage` and provide title, description, background and image.
        // AppIntro will do the rest.
        SliderPage sliderPage = new SliderPage();
        sliderPage.setTitle("Welcome to ChangeKeeper!");
        sliderPage.setDescription("The Easy-to-use money manager");
        sliderPage.setImageDrawable(R.drawable.ic_icon);
        sliderPage.setBgColor(Color.parseColor("#2ecc71"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage = new SliderPage();
        sliderPage.setTitle("Easily manage both your pocket cash and your bank account!");
        sliderPage.setDescription("You can check the current money or register transactions to either of the funds by sliding to their respective view.");
        sliderPage.setImageDrawable(R.drawable.ic_1);
        sliderPage.setBgColor(Color.parseColor("#1abc9c"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage = new SliderPage();
        sliderPage.setTitle("Register your incomes and expenses!");
        sliderPage.setDescription("Note down your transactions by sliding to the respective fund and hitting either of the register buttons.\nAdditionally ou can also transfer money between funds by hitting the transfer button");
        sliderPage.setImageDrawable(R.drawable.ic_2);
        sliderPage.setBgColor(Color.parseColor("#3498db"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage = new SliderPage();
        sliderPage.setTitle("Set up your allowances and subscriptions!");
        sliderPage.setDescription("By changing the frequency field in the register forms you can configure how often they'll repeat.\nYou can then access all of your allowances and subscriptions in their corresponding pages.");
        sliderPage.setImageDrawable(R.drawable.ic_3);
        sliderPage.setBgColor(Color.parseColor("#9b59b6"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage = new SliderPage();
        sliderPage.setTitle("Never forget who owes you money again!");
        sliderPage.setDescription("In the Loans page you can register your debts and loans or view the ones you've previously registered by sliding to the corresponding tab.\nYou can also register that you've paid or received money from debts by clicking on a specific Loan and hitting the pay/receive button.");
        sliderPage.setImageDrawable(R.drawable.ic_4);
        sliderPage.setBgColor(Color.parseColor("#e67e22"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage = new SliderPage();
        sliderPage.setTitle("Keep track of all your in and outflows of money!");
        sliderPage.setDescription("You can consult all of your transactions in the Info page and even visualize the sum of your money in and outtakes in a neat graph by sliding to the Graph page");
        sliderPage.setImageDrawable(R.drawable.ic_5);
        sliderPage.setBgColor(Color.parseColor("#f39c12"));
        addSlide(AppIntroFragment.newInstance(sliderPage));

        sliderPage.setTitle("Have fun using ChangeKeeper!");
        sliderPage.setDescription("Make your life easier and forget the hassle of having to remember all of your transactions :D!");
        sliderPage.setImageDrawable(R.drawable.ic_icon);
        sliderPage.setBgColor(Color.parseColor("#2ecc71"));
        addSlide(AppIntroFragment.newInstance(sliderPage));
    }

    @Override
    public void onSkipPressed(Fragment currentFragment) {
        super.onSkipPressed(currentFragment);
        startActivity(new Intent(this, MainActivity.class));
    }

    @Override
    public void onDonePressed(Fragment currentFragment) {
        super.onDonePressed(currentFragment);
        startActivity(new Intent(this, MainActivity.class));
    }
}