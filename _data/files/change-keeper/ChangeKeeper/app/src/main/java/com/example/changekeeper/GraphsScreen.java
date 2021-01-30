package com.example.changekeeper;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.BottomNavigationView;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;

public class GraphsScreen extends AppCompatActivity  implements  SearchDialog.SearchDialogListener{

    public static final String EXTRA_MESSAGE = "com.example.MainActivity.MESSAGE";
    private static final String TAG = "GRAPHS";

    private ActionBar toolbar;

    private ViewPager mPager;
    private PagerAdapter pageAdapter;
    public static int currentPage = 0;
    private static final int NUM_PAGES = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_graphs);

        toolbar = getSupportActionBar();
        toolbar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
        toolbar.setCustomView(R.layout.layout_actionbar);
        ((TextView)toolbar.getCustomView().findViewById(R.id.ourTitle)).setText("Graphs & Info");

        ImageButton butt  = toolbar.getCustomView().findViewById(R.id.settings);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                Intent intent = new Intent(v.getContext(), SettingsScreen.class);
                startActivity(intent);
            }
        });

        this.mPager = (ViewPager) findViewById(R.id.typeSelector);
        this.pageAdapter = new ScreenSlidePagerAdapter(getSupportFragmentManager());
        this.mPager.setAdapter(pageAdapter);

        this.mPager.setCurrentItem(this.currentPage);

        TabLayout tabLayout = findViewById(R.id.tab);
        tabLayout.setupWithViewPager(this.mPager);

        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setSelectedItemId(R.id.navigation_info);
        navigation.setOnNavigationItemSelectedListener((item) -> {
            switch (item.getItemId()) {
                case R.id.navigation_subscriptions:
                    startActivity(new Intent(this, SubscriptionScreen.class));
                    return true;
                case R.id.navigation_allowances:
                    startActivity(new Intent(this, AllowanceScreen.class));
                    return true;
                case R.id.navigation_home:
                    startActivity(new Intent(this, MainActivity.class));
                    return true;
                case R.id.navigation_loans:
                    startActivity(new Intent(this, LoanScreen.class));
                    return true;
                case R.id.navigation_info:
                    return true;
            }
            return false;
        });

        Log.v(TAG,"HELLOOOOOOOOOOOOOOOOOOOOOOOO :D");

    }

    @Override
    public void onBackPressed() {
        if (mPager.getCurrentItem() == 0) {
            // If the user is currently looking at the first step, allow the system to handle the
            // Back button. This calls finish() on this activity and pops the back stack.
            super.onBackPressed();
        } else {
            // Otherwise, select the previous step.
            mPager.setCurrentItem(mPager.getCurrentItem() - 1);
        }
    }

    @Override
    public void search(String from, String to, String desc) {
        AllInfoFragment fragment = (AllInfoFragment) ((ScreenSlidePagerAdapter)pageAdapter).getItem(0);
        fragment.search(from,to,desc);
    }

    @Override
    public void noUpdate() {

    }


    private class ScreenSlidePagerAdapter extends FragmentStatePagerAdapter {
        private Fragment graphsFrag;
        private Fragment infoFrag;

        public ScreenSlidePagerAdapter(FragmentManager fm) {
            super(fm);
            this.graphsFrag = new GraphsGraphsFragment();
            this.infoFrag = new AllInfoFragment();
        }

        @Override
        public Fragment getItem(int position) {
            if (position == 0)
                return this.infoFrag;
            else
                return this.graphsFrag;
        }

        @Override
        public int getCount() {
            return NUM_PAGES;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            if(position==0){
                return "Info";
            }else{
                return "Graphs";
            }
        }
    }

}
